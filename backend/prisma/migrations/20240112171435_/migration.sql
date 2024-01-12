-- DropForeignKey
ALTER TABLE `Camera` DROP FOREIGN KEY `Camera_ownerId_fkey`;

-- AddForeignKey
ALTER TABLE `Camera` ADD CONSTRAINT `Camera_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
