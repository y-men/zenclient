/*
  Warnings:

  - The primary key for the `SprintOwnerCommitment` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SprintOwnerCommitment" (
    "sprintId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "deductionId" INTEGER NOT NULL,
    "commited" INTEGER NOT NULL,

    PRIMARY KEY ("sprintId", "ownerId", "deductionId"),
    CONSTRAINT "SprintOwnerCommitment_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SprintOwnerCommitment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SprintOwnerCommitment" ("commited", "deductionId", "ownerId", "sprintId") SELECT "commited", "deductionId", "ownerId", "sprintId" FROM "SprintOwnerCommitment";
DROP TABLE "SprintOwnerCommitment";
ALTER TABLE "new_SprintOwnerCommitment" RENAME TO "SprintOwnerCommitment";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
