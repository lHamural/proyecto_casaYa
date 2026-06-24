/*
  Warnings:

  - You are about to drop the column `cloudinaryPublicId` on the `property_images` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `property_images` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `virtual_tours` table. All the data in the column will be lost.
  - Added the required column `originalPath` to the `property_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbPath` to the `property_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `webpPath` to the `property_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePath` to the `virtual_tours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalPath` to the `virtual_tours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property_images" DROP COLUMN "cloudinaryPublicId",
DROP COLUMN "url",
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "originalName" TEXT,
ADD COLUMN     "originalPath" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "thumbPath" TEXT NOT NULL,
ADD COLUMN     "webpPath" TEXT NOT NULL,
ADD COLUMN     "width" INTEGER;

-- AlterTable
ALTER TABLE "virtual_tours" DROP COLUMN "url",
ADD COLUMN     "imagePath" TEXT NOT NULL,
ADD COLUMN     "originalPath" TEXT NOT NULL,
ADD COLUMN     "title" TEXT;
