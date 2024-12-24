/*
  Warnings:

  - Added the required column `numbPayment` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "numbPayment" INTEGER NOT NULL;
