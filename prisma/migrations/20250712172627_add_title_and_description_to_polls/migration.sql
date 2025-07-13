/*
  Warnings:

  - Added the required column `Description` to the `Poll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Title` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Poll" ADD COLUMN     "Description" TEXT NOT NULL,
ADD COLUMN     "Title" TEXT NOT NULL;
