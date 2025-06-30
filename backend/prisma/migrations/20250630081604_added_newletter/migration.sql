-- CreateTable
CREATE TABLE "newsLetter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsLetter_pkey" PRIMARY KEY ("id")
);
