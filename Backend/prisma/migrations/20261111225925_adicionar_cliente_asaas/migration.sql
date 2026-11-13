/*
  Warnings:

  - A unique constraint covering the columns `[asaasCustomerId]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "asaasCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_asaasCustomerId_key" ON "Usuario"("asaasCustomerId");
