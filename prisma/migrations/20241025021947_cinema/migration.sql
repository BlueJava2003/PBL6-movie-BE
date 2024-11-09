/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Category_movie` table. All the data in the column will be lost.
  - You are about to drop the column `deleteAt` on the `Category_movie` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Category_movie` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Category_movie` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `capacity` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Category_movie" DROP COLUMN "createdAt",
DROP COLUMN "deleteAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "delete_at" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "capacity",
ADD COLUMN     "capacity" INTEGER NOT NULL;
