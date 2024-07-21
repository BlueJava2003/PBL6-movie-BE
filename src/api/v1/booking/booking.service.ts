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
    const availableSeatIds = roomState.availableSeats.map(
      (seat) => seat.seatId,
    );

    // Check if all seat IDs are available
    const isSeatAvailable = seatIds.every((id) =>
      availableSeatIds.includes(id),
    );

    if (!isSeatAvailable) {
      throw new HttpException(
        'One or more seats are not available',
        HttpStatus.BAD_REQUEST,
      );
    }

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

    const booking = this.prisma.booking.create({
      data: {
        scheduleId,
        accountId,
        seatsBooked: seatIds,
        totalPrice,
        state: State.PENDING,
      },
    });
    return booking;
  }

  async processPayment(
    accountId: number,
    paymentDto: PaymentBookingDto,
  ): Promise<Booking> {
    const { bookingId, paymentToken } = paymentDto;
    const hasBookingExisted = await this.prisma.booking.findUnique({
      where: { id: bookingId, accountId, state: State.PENDING },
    });
    if (!hasBookingExisted) {
      throw new HttpException('No payment found!', HttpStatus.BAD_REQUEST);
    }
    const verifyPayment = await this.verifyToken(paymentToken);
    if (verifyPayment.status === 'failure') {
      await this.prisma.booking.delete({ where: { id: bookingId } });
      throw new HttpException('Payment failure!', HttpStatus.BAD_REQUEST);
    }
    const updateRoomStateDto: UpdateRoomStateDto = {
      seatIds: hasBookingExisted.seatsBooked, // Your array of seat IDs
      // Include other properties as needed
    };
    await this.roomStateService.updateRoomState(
      hasBookingExisted.scheduleId,
      updateRoomStateDto,
    );
    const successBooking = await this.prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        state: State.SUCCESS,
      },
    });
    return successBooking;
  }

  async verifyToken(
    paymentToken: string,
  ): Promise<{ status: string; message: string }> {
    // Wait 2s
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const isSuccess = Math.random() > 0.2; // 80% success

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
  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
