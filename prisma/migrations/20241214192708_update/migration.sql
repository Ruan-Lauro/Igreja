/*
  Warnings:

  - You are about to drop the column `userId` on the `Payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropIndex
DROP INDEX "Payment_registeredId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "userId",
ADD COLUMN     "comprovante" TEXT;
