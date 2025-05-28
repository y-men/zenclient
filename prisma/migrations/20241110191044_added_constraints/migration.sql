/*
  Warnings:

  - The primary key for the `Constraint` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `project` on the `Constraint` table. All the data in the column will be lost.
  - Added the required column `epicId` to the `Constraint` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Constraint` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `ownerId` to the `Constraint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sprintId` to the `Constraint` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Constraint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Global',
    "epicId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "units" TEXT NOT NULL DEFAULT 'Absolute',
    "value" INTEGER NOT NULL,
    CONSTRAINT "Constraint_epicId_fkey" FOREIGN KEY ("epicId") REFERENCES "Epic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Constraint_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Constraint_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Constraint" ("name", "value") SELECT "name", "value" FROM "Constraint";
DROP TABLE "Constraint";
ALTER TABLE "new_Constraint" RENAME TO "Constraint";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
