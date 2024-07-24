import {
  formatToVietnamDay,
  formatToVietnamTime,
} from 'src/api/utils/formatDate';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma.service';
import { RoomStateService } from '../room-state/room-state.service';
import { Booking, State } from '@prisma/client';
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
      const hasScheduleExisted = await this.prisma.schedule.findUnique({
        where: {
          id: scheduleId,
        },
      });
      if (!hasScheduleExisted) {
        throw new HttpException('Schedule not found!', HttpStatus.BAD_REQUEST);
      }

      const roomState = await this.roomStateService.findRoomState(scheduleId);

      // Extract the available seat IDs
      const unavailableSeatIds = roomState.unavailableSeats.map(
        (seat) => seat.seatId,
      );

      // Filter out the seat Ids are unavailable
      const seatsBook = [...new Set(seatIds)]; // This is for removing dupication
      const unavailableSeats = seatsBook.filter((id) =>
        unavailableSeatIds.includes(id),
      );
      if (unavailableSeats.length !== 0) {
        throw new HttpException(
          `Seats with these IDs are not available: [${unavailableSeats.join(',')}]`,
          HttpStatus.BAD_REQUEST,
        );
      }
      //Update room state
      await this.roomStateService.updateRoomState(scheduleId, {
        seatIds: seatsBook,
      });
      //Calculate total price of all seats
      let totalPrice = 0;
      const seats = await this.prisma.seat.findMany({
        where: {
          id: {
            in: seatIds,
          },
        },
        include: {
          seatType: true,
        },
      });
      seats.forEach((seat) => {
        totalPrice += seat.seatType.price;
      });

      const booking = await this.prisma.booking.create({
        data: {
          scheduleId,
          accountId,
          seatsBooked: seatIds,
          totalPrice,
          state: State.PENDING,
        },
      });

      const payment = await this.verifyPayment();
      if (payment.status === 'failure') {
        this.prisma.booking.delete({ where: { id: booking.id } });
        throw new HttpException('Payment failure!', HttpStatus.BAD_REQUEST);
      }

      const updatedBooking = await this.prisma.booking.create({
        data: {
          scheduleId,
          accountId,
          seatsBooked: seatIds,
          totalPrice,
          state: State.SUCCESS,
        },
      });
      return updatedBooking;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async verifyPayment(): Promise<{ status: string; message: string }> {
    // Wait 2s
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isSuccess = Math.random() > 0.5; // 50% success

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
      const booking = await this.prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
      });

      if (!booking || booking.isDeleted || booking.state !== State.SUCCESS) {
        throw new HttpException('No booking found!', HttpStatus.BAD_REQUEST);
      }

      const seatsUpdate = [...new Set(updateBookingDto.seatIds)];

      const roomState = await this.prisma.roomState.findFirst({
        where: { scheduleId: booking.scheduleId },
      });

      if (!roomState) {
        throw new HttpException(
          'Room state not found!',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Update unavailable seats
      const newUnavailableSeats = roomState.unavailableSeat.filter(
        (id) => !seatsUpdate.includes(id),
      );

      //Remove booked seat in room state (reset back to the point before booking these )
      await this.prisma.roomState.update({
        where: { scheduleId: booking.scheduleId },
        data: {
          unavailableSeat: { set: newUnavailableSeats },
          availableSeat: { push: booking.seatsBooked },
        },
      });

      // Try to update room state if seats are booked or not
      const updateRoomStateDto: UpdateRoomStateDto = {
        seatIds: seatsUpdate,
      };
      await this.roomStateService.updateRoomState(
        booking.scheduleId,
        updateRoomStateDto,
      );

      // Recalculate total price of all seats
      const seats = await this.prisma.seat.findMany({
        where: {
          id: {
            in: seatsUpdate,
          },
        },
        include: {
          seatType: true,
        },
      });

      const totalPrice = seats.reduce((total, seat) => {
        return total + seat.seatType.price;
      }, 0);

      const updatedBooking = await this.prisma.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          seatsBooked: seatsUpdate,
          totalPrice,
        },
      });

      return updatedBooking;
    } catch (error) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
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
