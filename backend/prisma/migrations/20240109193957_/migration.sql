-- AlterTable
ALTER TABLE `Camera` ADD COLUMN `resolution` ENUM('R_144P', 'R_240P', 'R_360P', 'R_480P', 'R_720P', 'R_1080P', 'R_2K', 'R_4K') NOT NULL DEFAULT 'R_720P';
