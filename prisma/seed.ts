const { PrismaClient } = require("@prisma/client");

/*
 * Seed this database with some initial data.
 * Add a few sprints if none exist.
 */

const seed = async () => {
  const prisma = new PrismaClient({log: ["query", "error", "warn", "info"]});
  console.log("Seeding database...");
  console.log("Adding sprint data");
  const sprint = await prisma.sprint.findFirst();
  if (!sprint) {
    await prisma.sprint.createMany({
      data: [
        {name: "BKLG"}, //backlog
        {name: "S1Q1"},
        {name: "S2Q1"},
        {name: "S3Q1"},
      ],
    });
  }
  console.log("Adding owner data");
  const owner = await prisma.owner.findFirst();
    if (!owner) {
        await prisma.owner.createMany({
        data: [
            {name: "N/A"}, // unassigned
            {name: "Thor"},
            {name: "Fandral"},
            {name: "Hogun"},
            {name: "Volstagg"},
            {name: "Sif"},
        ],
        });
    }

  await prisma.$disconnect();
}

seed();


