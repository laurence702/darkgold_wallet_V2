/*
  Warnings:

  - You are about to drop the column `uid` on the `transaction_history` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `userProfiles` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `users` table. All the data in the column will be lost.
  - The `verificationCode` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `user_wallet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[t_ref]` on the table `transaction_history` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID]` on the table `userProfiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spID]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recipientId` to the `transaction_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `transaction_history` table without a default value. This is not possible if the table is not empty.
  - The required column `t_ref` was added to the `transaction_history` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `transaction_amount` to the `transaction_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `userProfiles` table without a default value. This is not possible if the table is not empty.
  - The required column `userID` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "userProfiles" DROP CONSTRAINT "userProfiles_userId_fkey";

-- DropIndex
DROP INDEX "transaction_history_uid_key";

-- DropIndex
DROP INDEX "userProfiles_userId_key";

-- DropIndex
DROP INDEX "users_uid_key";

-- AlterTable
ALTER TABLE "transaction_history" DROP COLUMN "uid",
ADD COLUMN     "recipientId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "t_ref" TEXT NOT NULL,
ADD COLUMN     "transaction_amount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "userProfiles" DROP COLUMN "userId",
ADD COLUMN     "userID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "uid",
ADD COLUMN     "acct_balance" DOUBLE PRECISION DEFAULT 0.00,
ADD COLUMN     "passwordChangedAt" TIMESTAMP(3),
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "spID" INTEGER,
ADD COLUMN     "txPin" INTEGER,
ADD COLUMN     "userID" TEXT NOT NULL,
DROP COLUMN "verificationCode",
ADD COLUMN     "verificationCode" INTEGER;

-- DropTable
DROP TABLE "user_wallet";

-- CreateIndex
CREATE UNIQUE INDEX "transaction_history_t_ref_key" ON "transaction_history"("t_ref");

-- CreateIndex
CREATE UNIQUE INDEX "userProfiles_userID_key" ON "userProfiles"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "users_userID_key" ON "users"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_spID_key" ON "users"("spID");

-- AddForeignKey
ALTER TABLE "userProfiles" ADD CONSTRAINT "userProfiles_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_history" ADD CONSTRAINT "transaction_history_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_history" ADD CONSTRAINT "transaction_history_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
