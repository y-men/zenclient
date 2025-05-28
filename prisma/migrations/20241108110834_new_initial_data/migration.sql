-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "sprintId" TEXT,
    "ownerId" TEXT,
    "epicId" TEXT,
    "loe" INTEGER,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "sequence" REAL,
    "status" INTEGER,
    "actual" INTEGER,
    "commited" INTEGER,
    "carryover" TEXT,
    "carryoverTaskId" TEXT,
    CONSTRAINT "Task_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_epicId_fkey" FOREIGN KEY ("epicId") REFERENCES "Epic" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_carryoverTaskId_fkey" FOREIGN KEY ("carryoverTaskId") REFERENCES "Task" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Constraint" (
    "project" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    PRIMARY KEY ("name", "project")
);

-- CreateTable
CREATE TABLE "Sprint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "quarterId" TEXT NOT NULL DEFAULT 'Q12024',
    CONSTRAINT "Sprint_quarterId_fkey" FOREIGN KEY ("quarterId") REFERENCES "Quarter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "SprintOwnerCommitment" (
    "sprintId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "deductionId" INTEGER NOT NULL,
    "commited" INTEGER NOT NULL,

    PRIMARY KEY ("sprintId", "ownerId"),
    CONSTRAINT "SprintOwnerCommitment_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SprintOwnerCommitment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Epic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "priority" INTEGER,
    "shortDesc" TEXT,
    "epicDesc" TEXT
);

-- CreateTable
CREATE TABLE "EpicOwnerCommitment" (
    "epicId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "sprintWeek" INTEGER NOT NULL,
    "commited" INTEGER NOT NULL,

    PRIMARY KEY ("epicId", "ownerId"),
    CONSTRAINT "EpicOwnerCommitment_epicId_fkey" FOREIGN KEY ("epicId") REFERENCES "Epic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EpicOwnerCommitment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EpicOwnerCommitment_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Quarter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "firstMonth" TEXT NOT NULL DEFAULT 'Jan',
    "displayName" TEXT
);

-- CreateTable
CREATE TABLE "QuarterOwnerCommitment" (
    "quarterId" TEXT NOT NULL,
    "epicId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "week" TEXT NOT NULL,
    "commited" INTEGER NOT NULL,

    PRIMARY KEY ("ownerId", "week", "epicId"),
    CONSTRAINT "QuarterOwnerCommitment_quarterId_fkey" FOREIGN KEY ("quarterId") REFERENCES "Quarter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuarterOwnerCommitment_epicId_fkey" FOREIGN KEY ("epicId") REFERENCES "Epic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuarterOwnerCommitment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuarterOwnerCommitment_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TaskDependency" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TaskDependency_A_fkey" FOREIGN KEY ("A") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TaskDependency_B_fkey" FOREIGN KEY ("B") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_TaskDependency_AB_unique" ON "_TaskDependency"("A", "B");

-- CreateIndex
CREATE INDEX "_TaskDependency_B_index" ON "_TaskDependency"("B");
