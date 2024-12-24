/*
  Warnings:

  - You are about to drop the column `comprovante` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "comprovante",
ADD COLUMN     "checking" TEXT;
