/*
  Warnings:

  - You are about to alter the column `value` on the `Constraint` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Constraint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Global',
    "epicId" TEXT,
    "ownerId" TEXT,
    "sprintId" TEXT,
    "units" TEXT NOT NULL DEFAULT 'Absolute',
    "value" REAL NOT NULL,
    CONSTRAINT "Constraint_epicId_fkey" FOREIGN KEY ("epicId") REFERENCES "Epic" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Constraint_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Constraint_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Constraint" ("epicId", "id", "name", "ownerId", "sprintId", "type", "units", "value") SELECT "epicId", "id", "name", "ownerId", "sprintId", "type", "units", "value" FROM "Constraint";
DROP TABLE "Constraint";
ALTER TABLE "new_Constraint" RENAME TO "Constraint";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
