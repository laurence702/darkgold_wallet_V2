-- CreateEnum
CREATE TYPE "PERMISSIONS" AS ENUM ('FULL_ACCESS', 'CAN_CREATE_USER', 'CAN_READ_USER', 'CAN_EDIT_USER', 'CAN_FULL_EDIT_USER', 'CAN_DELETE_USER', 'CAN_CREATE_ROLE', 'CAN_READ_ROLE', 'CAN_READ_ALL_ROLE', 'CAN_EDIT_ROLE', 'CAN_DELETE_ROLE', 'CAN_READ_PERMISSIONS', 'CAN_UPDATE_PERMISSIONS');

-- CreateEnum
CREATE TYPE "USER_ROLES" AS ENUM ('MEMBER', 'GUEST', 'ADMIN');

-- CreateEnum
CREATE TYPE "TRANSACTION_STATUS" AS ENUM ('PEDNING', 'COMPLETED');

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "acronymn" TEXT,
    "description" TEXT,
    "type" INTEGER NOT NULL DEFAULT 1,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rolePermissions" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "rolePermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL DEFAULT 1,
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "isVerified" INTEGER NOT NULL DEFAULT 0,
    "verificationCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adminProfiles" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "phoneNumber" TEXT,
    "profilePicture" TEXT,
    "about" TEXT,
    "address" TEXT,
    "state" TEXT,
    "country" TEXT,

    CONSTRAINT "adminProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "userID" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "txPin" INTEGER,
    "spID" TEXT,
    "acct_balance" DOUBLE PRECISION DEFAULT 0.00,
    "password" TEXT NOT NULL,
    "isVerified" INTEGER,
    "isActive" INTEGER,
    "verificationCode" INTEGER,
    "role" "USER_ROLES" NOT NULL DEFAULT E'MEMBER',
    "onlineStatus" INTEGER NOT NULL DEFAULT 0,
    "registeredIp" TEXT,
    "registeredCountry" TEXT,
    "registeredState" TEXT,
    "registeredRegion" TEXT,
    "registeredTimezone" TEXT,
    "registeredBrowser" TEXT,
    "registeredOperatingSytsem" TEXT,
    "registeredDeviceType" TEXT,
    "passwordChangedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userPasswordResets" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userPasswordResets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userProfiles" (
    "id" SERIAL NOT NULL,
    "userID" TEXT,
    "phoneNumber" TEXT,
    "biography" TEXT,
    "address" TEXT,
    "state" TEXT,
    "country" TEXT,
    "timezone" TEXT,
    "website" TEXT,
    "avatar" TEXT,

    CONSTRAINT "userProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_history" (
    "id" SERIAL NOT NULL,
    "t_ref" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "transaction_amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" SERIAL NOT NULL,
    "imageName" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "adminProfiles_adminId_key" ON "adminProfiles"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "users_userID_key" ON "users"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_spID_key" ON "users"("spID");

-- CreateIndex
CREATE UNIQUE INDEX "userProfiles_userID_key" ON "userProfiles"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_history_t_ref_key" ON "transaction_history"("t_ref");

-- CreateIndex
CREATE UNIQUE INDEX "Gallery_imageName_key" ON "Gallery"("imageName");

-- AddForeignKey
ALTER TABLE "rolePermissions" ADD CONSTRAINT "rolePermissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolePermissions" ADD CONSTRAINT "rolePermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adminProfiles" ADD CONSTRAINT "adminProfiles_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userProfiles" ADD CONSTRAINT "userProfiles_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("userID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_history" ADD CONSTRAINT "transaction_history_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("spID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_history" ADD CONSTRAINT "transaction_history_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("spID") ON DELETE RESTRICT ON UPDATE CASCADE;
