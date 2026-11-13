/*
  Warnings:

  - A unique constraint covering the columns `[asaasPaymentId]` on the table `Pagamento` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pagamento" ADD COLUMN     "asaasPaymentId" TEXT,
ADD COLUMN     "expiraEm" TIMESTAMP(3),
ADD COLUMN     "invoiceUrl" TEXT,
ADD COLUMN     "pixCopiaECola" TEXT,
ADD COLUMN     "pixQrCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Pagamento_asaasPaymentId_key" ON "Pagamento"("asaasPaymentId");
