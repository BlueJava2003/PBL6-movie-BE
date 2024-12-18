import {
  formatToVietnamDay,
  formatToVietnamTime,
} from 'src/api/utils/formatDate';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma.service';
import { RoomStateService } from '../room-state/room-state.service';
import { Booking, RoomState, State } from '@prisma/client';
import { PaymentBookingDto } from './dto/payment-booking.dto';
import { scheduled } from 'rxjs';
import { UpdateRoomStateDto } from '../room-state/dto/update-room-state.dto';
import { MailerService } from './../../mailer/mailer.service';
import { PaymentService } from 'src/api/v1/payment/payment.service';
import { consoleLogger, dateFormat, ignoreLogger, IpnFailChecksum, IpnSuccess, ReturnQueryFromVNPay, VerifyReturnUrl, VNPay, VnpLocale } from 'vnpay';
import { IpnUnknownError } from 'src/api/v1/payment/constant/ipn-result-for-vnpay.constant';
import { verify } from 'crypto';

@Injectable()
export class BookingService {

  private vnpay: VNPay;

  constructor(
    private prisma: PrismaService,
    private roomStateService: RoomStateService,
    private mailerService: MailerService,
  ) {
    this.vnpay = new VNPay({
      tmnCode: '3YEQFE65',
      secureSecret: 'OVA796S7VWPTLFESIDADARGWPWRUERT4',
      vnpayHost: 'https://sandbox.vnpayment.vn',
      testMode: true,
      enableLog: true,
      loggerFn: ignoreLogger,
    });
  }

  createPaymentUrl(amount: number, txnRef: string): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const paymentUrl = this.vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: '1.1.1.1',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: `order information`,
      // vnp_ReturnUrl: 'https://www.facebook.com/',
      vnp_ReturnUrl: 'http://localhost:3000/ticket-info',
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow),
    });
    return paymentUrl;
  }

  async handleIpn(query) {
    console.log('vao')
    try {
      const verify: VerifyReturnUrl = this.vnpay.verifyIpnCall(query);
      if (!verify) return IpnFailChecksum;
      const bookingId = Number(verify.vnp_TxnRef);
      if (verify.vnp_ResponseCode !== '00') {
        const booking = await this.prisma.booking.findUnique({
          where: {
            id: bookingId
          }
        })
        this.handlePaymentFailure(booking.id, booking.scheduleId, booking.seatsBooked);
      }
      await this.finalizeBooking(bookingId);
      return IpnSuccess;
    } catch (error) {
      return IpnUnknownError;
    }
  }

  getReturnUrl(query: any) {
    try {
      const result: VerifyReturnUrl = this.vnpay.verifyReturnUrl(query);
      if (!result.isVerified) {
        return {
          message: result?.message ?? 'Payment failed !',
          status: result.isSuccess
        }
      }
      return {
        message: result?.message ?? 'Payment successfull !',
        status: result.isSuccess,
        amount: (result.vnp_Amount).toLocaleString(),
        bankCode: result.vnp_BankCode,
        cardType: result.vnp_CardType,
        payDate: result.vnp_PayDate,
      }
    } catch (error) {
      return {
        message: 'Verify error',
        status: false,
      };
    }
  }

  private async handlePaymentFailure(
    bookingId: number,
    scheduleId: number,
    seatIds: number[],
  ): Promise<void> {
    await this.prisma.booking.delete({ where: { id: bookingId } });
    await this.resetRoomState(scheduleId, seatIds);
    throw new HttpException('Payment failure!', HttpStatus.BAD_REQUEST);
  }

  // private async handlePaymentFailure(
  //   booking: Booking,
  //   scheduleId: number,
  //   seatIds: number[],
  // ): Promise<void> {
  //   await this.prisma.booking.delete({ where: { id: booking.id } });
  //   await this.resetRoomState(scheduleId, seatIds);
  //   throw new HttpException('Payment failure!', HttpStatus.BAD_REQUEST);
  // }

  private async validateSchedule(scheduleId: number): Promise<void> {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id: scheduleId },
    });
    if (!schedule) throw new HttpException('Schedule not found!', HttpStatus.BAD_REQUEST);
  }

  private async validateSeatAvailability(scheduleId: number, seatIds: number[]): Promise<void> {
    const roomState = await this.prisma.roomState.findUnique({
      where: { scheduleId },
      include: {
        schedule: true,
      },
    });

    if (!roomState) throw new HttpException('No room state found!', HttpStatus.BAD_REQUEST);

    const startTime = new Date(roomState.schedule.timeStart);
    const now = Date.now();
    if (now > startTime.getTime()) {
      throw new HttpException(
        'This schedule is no longer to be booked!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const unavailableSeats = seatIds.filter((id) => roomState.unavailableSeat.includes(id));

    if (unavailableSeats.length > 0) {
      throw new HttpException(
        `Seats with these IDs are not available: [${unavailableSeats.join(',')}]`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async calculateTotalPrice(seatIds: number[]): Promise<number> {
    const seats = await this.prisma.seat.findMany({
      where: { id: { in: seatIds } },
      include: { seatType: true },
    });
    console.log('price => ', seats.reduce((total, seat) => total + seat.seatType.price, 0))
    return seats.reduce((total, seat) => total + seat.seatType.price, 0);
  }

  async verifyPayment(): Promise<{ status: string; message: string }> {
    // Wait 5s
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return { status: 'success', message: 'Token is valid' };
  }

  // Create a booking with PENDING state
  // async createBooking(accountId: number, createBookingDto: CreateBookingDto): Promise<{}> {
  //   try {
  //     const { scheduleId, seatIds } = createBookingDto;

  //     await this.validateSchedule(scheduleId);

  //     const seatsToBook = [...new Set(seatIds)]; // Remove duplicates

  //     if (seatsToBook.length > 8) {
  //       throw new HttpException(
  //         'Can not book more than 8 seats at the same time!',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     await this.validateSeatAvailability(scheduleId, seatsToBook);

  //     await this.roomStateService.updateRoomState(scheduleId, { seatIds }); //Update room state

  //     const totalPrice = await this.calculateTotalPrice(seatsToBook);

  //     const booking = await this.createInitialBooking(
  //       accountId,
  //       scheduleId,
  //       seatsToBook,
  //       totalPrice,
  //     );

  //     const paymentStatus = await this.verifyPayment();

  //     if (paymentStatus.status === 'failure') {
  //       await this.handlePaymentFailure(booking, scheduleId, seatIds);
  //     }

  //     return await this.finalizeBooking(booking.id);
  //   } catch (error) {
  //     throw new HttpException(error.message || 'Booking creation failed', HttpStatus.BAD_REQUEST);
  //   }
  // }

  // Create a booking with PENDING state
  async createBooking(accountId: number, createBookingDto: CreateBookingDto): Promise<{}> {
    try {
      const { scheduleId, seatIds } = createBookingDto;

      await this.validateSchedule(scheduleId);

      const seatsToBook = [...new Set(seatIds)]; // Remove duplicates

      if (seatsToBook.length > 8) {
        throw new HttpException(
          'Can not book more than 8 seats at the same time!',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.validateSeatAvailability(scheduleId, seatsToBook);

      await this.roomStateService.updateRoomState(scheduleId, { seatIds }); //Update room state

      const totalPrice = await this.calculateTotalPrice(seatsToBook);

      const booking = await this.createInitialBooking(
        accountId,
        scheduleId,
        seatsToBook,
        totalPrice,
      );

      return this.createPaymentUrl(totalPrice, booking.id.toString())
    } catch (error) {
      throw new HttpException(error.message || 'Booking creation failed', HttpStatus.BAD_REQUEST);
    }
  }

  private async createInitialBooking(
    accountId: number,
    scheduleId: number,
    seatsBooked: number[],
    totalPrice: number,
  ): Promise<Booking> {
    return this.prisma.booking.create({
      data: {
        scheduleId,
        accountId,
        seatsBooked,
        totalPrice,
        state: State.PENDING,
      },
    });
  }

  private async resetRoomState(
    scheduleId: number,
    seatIds: number[],
  ): Promise<void> {
    const roomState = await this.prisma.roomState.findFirst({
      where: { scheduleId },
    });
    const newUnavailableSeats = roomState.unavailableSeat.filter(
      (id) => !seatIds.includes(id),
    );

    await this.prisma.roomState.update({
      where: { scheduleId },
      data: {
        availableSeat: { push: seatIds },
        unavailableSeat: newUnavailableSeats,
      },
    });
  }

  async finalizeBooking(bookingId: number): Promise<{}> {
    const successBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { state: State.SUCCESS },
      select: {
        state: true,
        seatsBooked: true,
        createdAt: true,
        updatedAt: true,
        totalPrice: true,
        account: {
          select: { email: true, fullname: true },
        },
        schedule: {
          select: {
            movie: {
              select: {
                name: true,
              },
            },
            timeStart: true,
            roomState: {
              select: {
                room: {
                  select: {
                    roomName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const seatsBookedInfo = await this.prisma.seat.findMany({
      where: { id: { in: successBooking.seatsBooked } },
    });
    const seatsName = seatsBookedInfo.map((seat) => seat.name);
    const userEmail = successBooking.account.email;
    const emailContext = {
      movieName: successBooking.schedule.movie.name,
      hall: successBooking.schedule.roomState.room.roomName,
      seats: seatsName.join(', '),
      paymentTime: `${formatToVietnamDay(successBooking.updatedAt)} ${formatToVietnamTime(successBooking.updatedAt)}`,
      showTime: `${formatToVietnamDay(successBooking.schedule.timeStart)} ${formatToVietnamTime(successBooking.schedule.timeStart)}`,
      totalAmount: `${successBooking.totalPrice}`,
    };
    await this.mailerService.sendMail(
      userEmail,
      'Thông tin đặt vé xem phim',
      `Xin chào ${successBooking.account.fullname}, đây là thông tin đặt vé xem phim của bạn.`,
      this.mailerService.createHtml(emailContext), //Create HTML to send email
    );
    return successBooking;
  }

  async findAllHistory(): Promise<{}> {
    const booking = await this.prisma.booking.findMany({
      where: {
        state: State.SUCCESS,
        isDeleted: false,
      },
      omit: {
        isDeleted: true,
      },
      include: {
        schedule: {
          select: {
            date: true,
            roomState: {
              select: {
                room: {
                  select: {
                    id: true,
                    roomName: true,
                  },
                },
              },
            },
            movie: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return booking;
  }

  //Find all booking history of user
  async findAllUserBookingHistory(accountId: number): Promise<{}> {
    try {
      const booking = await this.prisma.booking.findMany({
        where: {
          accountId,
          isDeleted: false,
        },
        omit: {
          isDeleted: true,
        },
        include: {
          schedule: {
            select: {
              timeStart: true,
              timeEnd: true,
              date: true,
              roomState: {
                select: {
                  room: {
                    select: {
                      id: true,
                      roomName: true,
                    },
                  },
                },
              },
              movie: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return booking;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // Find booking history of user
  async findUserBookingHistory(
    accountId: number,
    bookingId: number,
  ): Promise<{}> {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: {
          id: bookingId,
          accountId,
          isDeleted: false,
        },
        omit: {
          isDeleted: true,
        },
        include: {
          schedule: {
            select: {
              timeStart: true,
              timeEnd: true,
              date: true,
              roomState: {
                select: {
                  room: {
                    select: {
                      id: true,
                      roomName: true,
                    },
                  },
                },
              },
              movie: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!booking)
        throw new HttpException('No booking found!', HttpStatus.BAD_REQUEST);

      // Get seat info to add into response
      const seatsInfo = await this.prisma.seat.findMany({
        where: {
          id: {
            in: booking.seatsBooked,
          },
        },
        select: {
          id: true,
          name: true,
          seatType: true,
        },
      });

      // Format response
      const timeStart = `${formatToVietnamDay(booking.schedule.timeStart)} ${formatToVietnamTime(booking.schedule.timeStart)}`;
      const timeEnd = `${formatToVietnamDay(booking.schedule.timeEnd)} ${formatToVietnamTime(booking.schedule.timeEnd)}`;

      const historyResponse = {
        ...booking,
        seatsBooked: seatsInfo,
        schedule: {
          ...booking.schedule,
          timeStart: timeStart,
          timeEnd: timeEnd,
        },
      };
      return historyResponse;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // Just for changing seat position with SUCCESS bookings (ADMIN)
  async updateBooking(
    bookingId: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    try {
      const booking = await this.findAndValidateBooking(bookingId);
      const seatsUpdate = [...new Set(updateBookingDto.seatIds)];
      const roomState = await this.findRoomState(booking.scheduleId);
      await this.validateSeatAvailability(roomState.scheduleId, seatsUpdate);

      await this.updateRoomStateSeats(
        roomState,
        booking.seatsBooked,
        seatsUpdate,
      );
      await this.roomStateService.updateRoomState(booking.scheduleId, {
        seatIds: seatsUpdate,
      });

      const totalPrice = await this.calculateTotalPrice(seatsUpdate);
      return this.updateBookingDetails(bookingId, seatsUpdate, totalPrice);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'An error occurred while updating the booking',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async findAndValidateBooking(bookingId: number): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking || booking.isDeleted || booking.state !== State.SUCCESS) {
      throw new HttpException('No booking found!', HttpStatus.BAD_REQUEST);
    }
    return booking;
  }

  private async findRoomState(scheduleId: number): Promise<RoomState> {
    const roomState = await this.prisma.roomState.findFirst({
      where: { scheduleId },
    });
    if (!roomState) {
      throw new HttpException('Room state not found!', HttpStatus.BAD_REQUEST);
    }
    return roomState;
  }

  private async updateRoomStateSeats(
    roomState: RoomState,
    oldSeats: number[],
    newSeats: number[],
  ): Promise<void> {
    const newUnavailableSeats = roomState.unavailableSeat.filter(
      (id) => !newSeats.includes(id),
    );
    await this.prisma.roomState.update({
      where: { scheduleId: roomState.scheduleId },
      data: {
        unavailableSeat: { set: newUnavailableSeats },
        availableSeat: { push: oldSeats },
      },
    });
  }

  private async updateBookingDetails(
    bookingId: number,
    seatsBooked: number[],
    totalPrice: number,
  ): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { seatsBooked, totalPrice },
    });
  }
  //Soft delete a booking
  async remove(bookingId: number): Promise<void> {
    try {
      const booking = this.prisma.booking.findUnique({
        where: {
          id: bookingId,
          isDeleted: false,
        },
      });
      if (!booking) {
        throw new HttpException('Booking not found!', HttpStatus.BAD_REQUEST);
      }
      await this.prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          isDeleted: true,
        },
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
