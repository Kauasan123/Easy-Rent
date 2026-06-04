/*
  Warnings:

  - Added the required column `atualizadoEm` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `atualizadoEm` DATETIME(3) NOT NULL,
    ADD COLUMN `avatarPath` VARCHAR(191) NULL,
    ADD COLUMN `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `senha` VARCHAR(191) NOT NULL,
    ADD COLUMN `telefone` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Periodo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inicio` DATETIME(3) NOT NULL,
    `fim` DATETIME(3) NOT NULL,
    `imovelId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Imovel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `descricao` TEXT NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `preco` DOUBLE NOT NULL,
    `tipoCobranca` VARCHAR(191) NOT NULL,
    `capacidade` VARCHAR(191) NOT NULL,
    `quartos` INTEGER NOT NULL,
    `banheiros` INTEGER NOT NULL,
    `vagas` INTEGER NOT NULL,
    `proximoCentro` BOOLEAN NOT NULL,
    `proximoPraia` BOOLEAN NOT NULL,
    `hasWifi` BOOLEAN NOT NULL,
    `hasMaquinaLavar` BOOLEAN NOT NULL,
    `hasArCondicionado` BOOLEAN NOT NULL,
    `hasChurrascaria` BOOLEAN NOT NULL,
    `hasEstacionamento` BOOLEAN NOT NULL,
    `hasElevador` BOOLEAN NOT NULL,
    `hasPiscina` BOOLEAN NOT NULL,
    `hasPortaria24h` BOOLEAN NOT NULL,
    `hasTv` BOOLEAN NOT NULL,
    `aceitaPets` BOOLEAN NOT NULL,
    `permiteFestas` BOOLEAN NOT NULL,
    `acessibilidade` BOOLEAN NOT NULL,
    `naoFumante` BOOLEAN NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Imagem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `imovelId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Periodo` ADD CONSTRAINT `Periodo_imovelId_fkey` FOREIGN KEY (`imovelId`) REFERENCES `Imovel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Imovel` ADD CONSTRAINT `Imovel_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Imagem` ADD CONSTRAINT `Imagem_imovelId_fkey` FOREIGN KEY (`imovelId`) REFERENCES `Imovel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
