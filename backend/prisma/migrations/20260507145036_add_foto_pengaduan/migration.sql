/*
  Warnings:

  - You are about to drop the column `gambar` on the `pengaduan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pengaduan` DROP COLUMN `gambar`,
    ADD COLUMN `foto` VARCHAR(191) NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'Menunggu';
