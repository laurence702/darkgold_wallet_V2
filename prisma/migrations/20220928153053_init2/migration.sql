/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "transaction_history" DROP CONSTRAINT "transaction_history_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "transaction_history" DROP CONSTRAINT "transaction_history_senderId_fkey";

-- DropForeignKey
ALTER TABLE "userProfiles" DROP CONSTRAINT "userProfiles_userID_fkey";

-- DropIndex
DROP INDEX "users_phoneNumber_key";

-- AlterTable
ALTER TABLE "userProfiles" ALTER COLUMN "userID" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "phoneNumber",
ALTER COLUMN "spID" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "userProfiles" ADD CONSTRAINT "userProfiles_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_history" ADD CONSTRAINT "transaction_history_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("spID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_history" ADD CONSTRAINT "transaction_history_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("spID") ON DELETE RESTRICT ON UPDATE CASCADE;
