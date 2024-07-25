/*
  Warnings:

  - You are about to drop the column `account_id` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `schedule_id` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `seatStateId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `SeatState` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accountId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_account_id_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_seatStateId_fkey";

-- DropForeignKey
ALTER TABLE "SeatState" DROP CONSTRAINT "SeatState_roomId_fkey";

-- DropForeignKey
ALTER TABLE "SeatState" DROP CONSTRAINT "SeatState_seatId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "account_id",
DROP COLUMN "schedule_id",
DROP COLUMN "seatStateId",
ADD COLUMN     "accountId" INTEGER NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scheduleId" INTEGER NOT NULL,
ADD COLUMN     "seatsBooked" INTEGER[],
ADD COLUMN     "totalPrice" INTEGER NOT NULL;

-- DropTable
DROP TABLE "SeatState";

-- CreateTable
CREATE TABLE "RoomState" (
    "id" SERIAL NOT NULL,
    "scheduleId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "availableSeat" INTEGER[],
    "unavailableSeat" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomState_scheduleId_key" ON "RoomState"("scheduleId");

-- AddForeignKey
ALTER TABLE "RoomState" ADD CONSTRAINT "RoomState_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomState" ADD CONSTRAINT "RoomState_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
