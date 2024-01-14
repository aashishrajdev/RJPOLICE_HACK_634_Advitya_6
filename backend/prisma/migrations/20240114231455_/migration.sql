/*
  Warnings:

  - Added the required column `latitude` to the `Camera` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Camera` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Camera` ADD COLUMN `latitude` DOUBLE NOT NULL,
    ADD COLUMN `longitude` DOUBLE NOT NULL;
