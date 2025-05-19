-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('hourly', 'daily');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "frequency" "Frequency" NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_email_key" ON "Subscription"("email");
