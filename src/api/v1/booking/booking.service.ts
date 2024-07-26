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

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private roomStateService: RoomStateService,
  ) {}
  //Create a booking with PENDING state
  async createBooking(
    accountId: number,
    createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    try {
      const { scheduleId, seatIds } = createBookingDto;

      await this.validateSchedule(scheduleId);

      const seatsToBook = [...new Set(seatIds)]; // Remove duplicates

      await this.validateSeatAvailability(scheduleId, seatsToBook);

      await this.roomStateService.updateRoomState(scheduleId, { seatIds }); //Update room state

      const totalPrice = await this.calculateTotalPrice(seatsToBook);

      const booking = await this.createInitialBooking(
        accountId,
        scheduleId,
        seatsToBook,
        totalPrice,
      );

      const paymentStatus = await this.verifyPayment();

      if (paymentStatus.status === 'failure') {
        await this.handlePaymentFailure(booking, scheduleId, seatIds);
      }

      return await this.finalizeBooking(booking.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Booking creation failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async validateSchedule(scheduleId: number): Promise<void> {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id: scheduleId },
    });
    if (!schedule) {
      throw new HttpException('Schedule not found!', HttpStatus.BAD_REQUEST);
    }
  }

  private async validateSeatAvailability(
    scheduleId: number,
    seatIds: number[],
  ): Promise<void> {
    const roomState = await this.prisma.roomState.findUnique({
      where: { scheduleId },
    });
    const unavailableSeats = seatIds.filter((id) =>
      roomState.unavailableSeat.includes(id),
    );

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
    return seats.reduce((total, seat) => total + seat.seatType.price, 0);
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

  private async handlePaymentFailure(
    booking: Booking,
    scheduleId: number,
    seatIds: number[],
  ): Promise<void> {
    await this.prisma.booking.delete({ where: { id: booking.id } });
    await this.resetRoomState(scheduleId, seatIds);
    throw new HttpException('Payment failure!', HttpStatus.BAD_REQUEST);
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

  private async finalizeBooking(bookingId: number): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { state: State.SUCCESS },
    });
  }
  async verifyPayment(): Promise<{ status: string; message: string }> {
    // Wait 5s
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const isSuccess = Math.random() > 0.3; // 70% success

    if (isSuccess) {
      return {
        status: 'success',
        message: 'Token is valid',
      };
    } else {
      return {
        status: 'failure',
        message: 'Token is invalid or verification failed',
      };
    }
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
  //Find booking history of user
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

      //Get seat info to add into response
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

      //Format response
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

  //Just for changing seat position with SUCCESS bookings (ADMIN)
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
