
import 'reflect-metadata';  // Import metadata polyfill at the very top
//@ts-ignore
// This file is run as a script, with its own context, so we need to import the polyfill here as well
import {ISaveQuarterlyPlanUseCase} from "@/model/types";
//@ts-ignore
import container from "@/model/inversify.config";
//@ts-ignore
import {TYPES} from "@/model/container";

import { PrismaClient } from "@prisma/client";
interface IOwnerCommitment {
    id: string;
    name: string ;
    [key: string]: string; // Allow dynamic week properties (w1, w2, etc.)
}

const seed = async () => {
    const prisma = new PrismaClient({ log: ["query", "error", "warn", "info"] });
    console.log("Seeding database...");

    try {
        // Clear existing data
        console.log("0. Clearing existing data...");
        await prisma.$transaction([
            // 1. Delete junction/relationship tables first
            prisma.quarterOwnerCommitment.deleteMany({}),
            prisma.epicOwnerCommitment.deleteMany({}),
            prisma.sprintOwnerCommitment.deleteMany({}),

            // 2. Delete tables with foreign keys but no dependents
            prisma.task.deleteMany({}),

            // 3. Delete main entity tables in correct order
            prisma.sprint.deleteMany({}),
            prisma.quarter.deleteMany({}),
            prisma.epic.deleteMany({}),
            prisma.owner.deleteMany({}),
            prisma.constraint.deleteMany({})
        ]);


        // 1. Create Owners
        console.log("1. Adding owner data");
        const owners = await Promise.all([
            prisma.owner.create({ data: { name: "N/A" } }),
            prisma.owner.create({ data: { name: "Thor" } }),
            prisma.owner.create({ data: { name: "Fandral" } }),
            prisma.owner.create({ data: { name: "Hogun" } }),
            prisma.owner.create({ data: { name: "Volstagg" } }),
            prisma.owner.create({ data: { name: "Sif" } })
        ]);

        // 2. Create Epics
        console.log("2. Adding epic data");
        const epics = await Promise.all([
            prisma.epic.create({
                data: {
                    name: "BRIDGE",
                    shortDesc: "Restore rainbow bridge functionality after recent damage",
                    epicDesc: "Complete reconstruction of the Bifrost Bridge to ensure safe travel between the Nine Realms.",
                    priority: 1
                }
            }),
            prisma.epic.create({
                data: {
                    name: "ASGARD",
                    shortDesc: "Strengthen realm security protocols",
                    epicDesc: "Comprehensive upgrade of Asgard's defensive capabilities.",
                    priority: 1
                }
            }),
            prisma.epic.create({
                data: {
                    name: "YGG",
                    shortDesc: "Set up World Tree monitoring system",
                    epicDesc: "Create comprehensive monitoring system for the Nine Realms' connection points.",
                    priority: 2
                }
            }),
            prisma.epic.create({
                data: {
                    name: "DRAGON",
                    shortDesc: "Implement dragon control measures",
                    epicDesc: "Establish proper protocols for handling dragons in Asgard's airspace.",
                    priority: 3
                }
            })
        ]);

        // 3. Prepare FormData for saveQuarterlyPlan
        console.log("3. Preparing data for saveQuarterlyPlan");

        // Add quarter information
        const qdata = {
            year: "2024",
            quarterName: "Q22024",
            quarter: "Q2",
            firstMonth: "Apr",
            sprintData:<any>[]
         };

        // Prepare sprint data matching UI format
        const sprintData = owners.map(owner => {
            if (owner.name === "N/A") return null;

            const ownerCommitments :IOwnerCommitment = {
                id: owner.id,
                // @ts-ignore
                name: owner.name
            };

            // Assign epics to weeks based on a pattern
            switch (owner.name) {
                case "Thor":
                    ownerCommitments.w1 = epics[0].id; // BRIDGE for 2 weeks
                    ownerCommitments.w2 = epics[0].id;
                    ownerCommitments.w3 = epics[1].id; // ASGARD for 2 weeks
                    ownerCommitments.w4 = epics[1].id;
                    break;
                case "Sif":
                    ownerCommitments.w3 = epics[1].id; // ASGARD for 2 weeks
                    ownerCommitments.w4 = epics[1].id;
                    ownerCommitments.w5 = epics[3].id; // DRAGON for 2 weeks
                    ownerCommitments.w6 = epics[3].id;
                    break;
                case "Fandral":
                    ownerCommitments.w1 = epics[2].id; // YGG for 2 weeks
                    ownerCommitments.w2 = epics[2].id;
                    ownerCommitments.w5 = epics[3].id; // DRAGON for 2 weeks
                    ownerCommitments.w6 = epics[3].id;
                    break;
                case "Hogun":
                    ownerCommitments.w7 = epics[1].id; // ASGARD for 2 weeks
                    ownerCommitments.w8 = epics[1].id;
                    ownerCommitments.w9 = epics[2].id; // YGG for 2 weeks
                    ownerCommitments.w10 = epics[2].id;
                    break;
                case "Volstagg":
                    ownerCommitments.w7 = epics[3].id; // DRAGON for 2 weeks
                    ownerCommitments.w8 = epics[3].id;
                    ownerCommitments.w11 = epics[0].id; // BRIDGE for 2 weeks
                    ownerCommitments.w12 = epics[0].id;
                    break;
            }

            return ownerCommitments;
        }).filter(Boolean);

        // Add sprint data to FormData
        qdata.sprintData = sprintData //JSON.stringify(sprintData);

        // 4. Call saveQuarterlyPlan with our prepared FormData
        console.log("4. Calling saveQuarterlyPlan with prepared data");
        // const saveQuarterlyPlanUseCase = new SaveQuarterlyPlanUseCase();
        // await saveQuarterlyPlanUseCase.saveQuarterlyPlan(qdata);

        // Use container to trigger the injections
        const saveQuarterlyPlanUseCase = container.get<ISaveQuarterlyPlanUseCase>(TYPES.SaveQuarterlyPlanUseCase);
        await saveQuarterlyPlanUseCase.saveQuarterlyPlan(qdata);

        // 5. Add some sample tasks
        console.log("5. Adding task data");
        const tasksData = [
            {
                name: "Calibrate Bifrost energy matrix",
                desc: "Fine-tune the rainbow bridge's quantum alignment for safe interdimensional travel",
                epicId: epics[0].id,
                ownerId: owners[1].id, // Thor
                sprintId: `S1Q22024`,
                loe: 5,
                startDate: new Date("2024-04-01"),
                endDate: new Date("2024-04-05"),
                status: 0,
                sequence: 1.0
            },
            {
                name: "Deploy shield generators",
                desc: "Install and configure new shield generators around Asgard's perimeter",
                epicId: epics[1].id,
                ownerId: owners[5].id, // Sif
                sprintId: `S2Q22024`,
                loe: 3,
                startDate: new Date("2024-04-15"),
                endDate: new Date("2024-04-17"),
                status: 0,
                sequence: 1.0
            }
        ];

        for (const taskData of tasksData) {
            await prisma.task.create({ data: taskData });
        }

        await prisma.$disconnect();
        console.log("Database seeding completed successfully!");

    } catch (error) {
        console.error("Error seeding database:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

seed();
