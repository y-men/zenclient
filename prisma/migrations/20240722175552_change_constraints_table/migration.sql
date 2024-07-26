/*
  Warnings:

  - The primary key for the `Constraint` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Constraint` table. All the data in the column will be lost.
  - Made the column `project` on table `Constraint` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Constraint" (
    "project" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    PRIMARY KEY ("name", "project")
);
INSERT INTO "new_Constraint" ("name", "project", "value") SELECT "name", "project", "value" FROM "Constraint";
DROP TABLE "Constraint";
ALTER TABLE "new_Constraint" RENAME TO "Constraint";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
