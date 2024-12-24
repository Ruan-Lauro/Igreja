-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registered" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "allergy" BOOLEAN NOT NULL,
    "allergyDetails" TEXT,
    "medication" BOOLEAN NOT NULL,
    "medicationDetails" TEXT,
    "guardianName" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "referencePoint" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Registered_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "registeredId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Registered_cpf_key" ON "Registered"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Registered_userId_key" ON "Registered"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_registeredId_key" ON "Payment"("registeredId");

-- AddForeignKey
ALTER TABLE "Registered" ADD CONSTRAINT "Registered_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_registeredId_fkey" FOREIGN KEY ("registeredId") REFERENCES "Registered"("id") ON DELETE CASCADE ON UPDATE CASCADE;
