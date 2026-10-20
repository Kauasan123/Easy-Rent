-- CreateTable
CREATE TABLE "Conversa" (
    "id" SERIAL NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadaEm" TIMESTAMP(3) NOT NULL,
    "imovelId" INTEGER NOT NULL,
    "locatarioId" INTEGER NOT NULL,
    "proprietarioId" INTEGER NOT NULL,

    CONSTRAINT "Conversa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mensagem" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lidaEm" TIMESTAMP(3),
    "conversaId" INTEGER NOT NULL,
    "remetenteId" INTEGER NOT NULL,

    CONSTRAINT "Mensagem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversa_locatarioId_idx" ON "Conversa"("locatarioId");

-- CreateIndex
CREATE INDEX "Conversa_proprietarioId_idx" ON "Conversa"("proprietarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversa_imovelId_locatarioId_key" ON "Conversa"("imovelId", "locatarioId");

-- CreateIndex
CREATE INDEX "Mensagem_conversaId_criadaEm_idx" ON "Mensagem"("conversaId", "criadaEm");

-- CreateIndex
CREATE INDEX "Mensagem_remetenteId_idx" ON "Mensagem"("remetenteId");

-- AddForeignKey
ALTER TABLE "Conversa" ADD CONSTRAINT "Conversa_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversa" ADD CONSTRAINT "Conversa_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversa" ADD CONSTRAINT "Conversa_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_conversaId_fkey" FOREIGN KEY ("conversaId") REFERENCES "Conversa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_remetenteId_fkey" FOREIGN KEY ("remetenteId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
