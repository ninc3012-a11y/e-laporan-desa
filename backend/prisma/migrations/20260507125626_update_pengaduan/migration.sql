-- AlterTable
ALTER TABLE `pengaduan` ADD COLUMN `gambar` VARCHAR(191) NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'Pending';
