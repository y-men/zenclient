
"use server";
import {redirect, usePathname} from "next/navigation";
import {
    TaskRepository,
    SQLLiteTaskRepository,
    SQLLiteSprintRepository,
    SQLLiteConstraintRepository,
    SQLLiteOwnerRepository, SQLLiteEpicRepository, SQLLiteQuartersRepository, SQLLiteQuarterOwnerCommitmentRepository
} from "@/db";
import {revalidatePath} from "next/cache";
import {dlog, getCurrentQuarter} from "@/utils";

import {
    IConstraint,
    IConstraintUseCase,
    ISaveQuarterlyPlanUseCase,
    ITask
} from "@/model/types";
import container from "@/model/inversify.config";
import {TYPES} from "@/model/container";

// Todo use injection
const taskRepository: SQLLiteTaskRepository = new SQLLiteTaskRepository();
const sprintRepository: SQLLiteSprintRepository = new SQLLiteSprintRepository();
//const constraintRepository: SQLLiteConstraintRepository = new SQLLiteConstraintRepository();
const ownersRepository: SQLLiteOwnerRepository = new SQLLiteOwnerRepository();
const epicRepository: SQLLiteEpicRepository = new SQLLiteEpicRepository();
const quarterRepository: SQLLiteQuartersRepository = new SQLLiteQuartersRepository()
const quarterlyRepositoy = new SQLLiteQuartersRepository();
const quarterOwnerCommitmentRepository = new SQLLiteQuarterOwnerCommitmentRepository();


// TODO: refactor: Consider moving the form oprations to /app pages
// TODO: refactor: Consider moving to /actions/forms ....




// -- Epic Form operations -----------------

// @ts-ignore
export async function retriveEpicsHeadCountInvestment(): Promise<number[][]> {
    dlog()
    // Retrieve the commitment data for the epics
    const currentQuarter = getCurrentQuarter();
    const commitments = await quarterOwnerCommitmentRepository.getCommitmentsByQuarter(currentQuarter) || [];
    console.dir(commitments);

    const epics = await epicRepository.getAll() || [];
    const owners = await ownersRepository.getAll() || [];

    // Create a map to store the accumulated commitment for each epic per owner
    const epicOwnerCommitment: Map<string, Map<string, number>> = new Map();

    // Initialize the map with all epics and owners, setting initial commitments to 0
    epics.forEach(epic => {
        const ownerMap = new Map<string, number>();
        owners.forEach(owner => {
            ownerMap.set(owner.id, 0);
        });
        epicOwnerCommitment.set(epic.id, ownerMap);
    });

    // Calculate the total number of weeks in the quarter
    const totalWeeksInQuarter = 12; // Assuming a standard quarter with 12 weeks

    // Process each commitment
    for (const commitment of commitments) {
        const epicKey = commitment.epicId;
        const ownerKey = commitment.ownerId;

        if (epicOwnerCommitment.has(epicKey)) {
            const ownerMap = epicOwnerCommitment.get(epicKey)!;
            const currentCommitment = ownerMap.get(ownerKey) || 0;
            // @ts-ignore
            ownerMap.set(ownerKey, currentCommitment + commitment.commited);
        }
    }

    // Convert the map to a matrix
    const matrix: number[][] = epics.map(epic => {
        const ownerMap = epicOwnerCommitment.get(epic.id);
        if (!ownerMap) {
            return owners.map(() => 0); // Return an array of zeros if no commitments for this epic
        }
        return owners.map(owner => {
            const commitment = ownerMap.get(owner.id) || 0;
            return commitment / totalWeeksInQuarter; // Convert to 1/x format
        });
    });

    console.log(">>>>> Matrix data");
    console.dir(matrix);

    return matrix;
}

export async function addEpicFormAction(formData: FormData): Promise<void> {
    dlog()
    console.log(formData);
    await epicRepository.create({
        name: formData.get("name") as string,
        shortDesc: formData.get("shortDescription") as string,
        epicDesc: formData.get("epicDescription") as string,
        priority: parseInt(formData.get("priority") as string) ?? 99
    });
    revalidatePath("/epic");
    redirect("/epic");
}

/**
 * Handle additional information nedded for calculation of constraints values
 * @param formData
 */
// export async function updateConstraintData(formData: FormData): Promise<void> {
//     let promises: Promise<{ name: string, value: number, project: string }>[] = [];
//     Array.from(formData.entries()).forEach(([key, value]) => {
//         console.log(`>> ${key}, ${value}  `);
//         const p: Promise<{ name: string; value: number; project: string }> =
//             constraintRepository.upsert({name: key, value: parseInt(value as string, 10), project: "ALL"})
//         promises.push(p);
//
//     })
//     Promise.allSettled(promises!).then(() => {
//         console.log("All constraints updated");
//     })
//
//     // todo Redirect or provide feedback after submission
// }

/**
 * Create a task with the given form data
 * Update the sequence number of the task ( == id ) for creating with form
 * Calculate the end date based on the start date and LOE
 * @param formData
 */
export async function createTask(formData: FormData) {
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const sloe = formData.get("loe") as string;
    const loe = sloe ? parseInt(sloe, 10) : 0;
    // @ts-ignore
    await createOrUpdateTaskDbEntry({
            name: formData.get("title") as string,
            desc: formData.get("desc") as string,
            loe: loe
        }
    );
    revalidatePath("/plan");
    redirect("/plan");
}


// -- Image operations -----------------

export async function getRandomImage() {
    const res = await fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.PUBLIC_UNSPLASH_ACCESS_KEY}`);
    if (!res.ok) {
        throw new Error("Failed to fetch image from Unsplash");
    }
    return await res.json();
}

// -- Quarterly Form operations -----------------

export async function saveQuarterlyPlan(formData: FormData, isRevalidatePage: boolean = true): Promise<void> {
    "use server"
    const saveQuarterlyPlanUseCase = container.get<ISaveQuarterlyPlanUseCase>(TYPES.SaveQuarterlyPlanUseCase);
    const data = {
        quarterName: formData.get("quarterName") as string,
        year: formData.get("year") as string,
        quarter: formData.get("quarter") as string,
        firstMonth: formData.get("firstMonth") as string,
        sprintData: JSON.parse(formData.get("sprintData") as string)
    };

    // Save the quarterly plan with use case method
    await saveQuarterlyPlanUseCase.saveQuarterlyPlan(data);
    revalidatePath("/quarterly");
    redirect("/quarterly");
}



// -- Retrieve operations -----------------
export async function retrieveConstraints(): Promise<IConstraint[] | null> {
    console.log("====> Retrieving constraints");

    // TODO Will be able to inject this when we get the actions into class ?
    const constraintUseCase = container.get<IConstraintUseCase>(TYPES.ConstraintUseCase);
    const constraints = await constraintUseCase.getAllConstraints();
    return constraints;
}

export async function retrieveQuarterlyPlans(): Promise<{ id: string, name: string, firstMonth: string  }[]> {
    // console.log("====> Retrieving QuarterlyPlans");
    const quarters = await quarterRepository.getAll();
    // console.dir( quarters)
    //@ts-ignore
    return quarters as { id: string; name: string; firstMonth:string  }[];
}

export async function retrieveEpics(): Promise<{ id: string, name: string, shortDesc?: string, epicDesc?: string, priority?: number }[] | null> {
    console.log("====> Retrieving epics");
    const epics = await epicRepository.getAll();
    // console.dir(epics);
    return epics;
}

export async function retrieveOwners(): Promise<{ id: string; name: string }[]> {
    console.log("====> Retrieving owners");
    const owners = await ownersRepository.getAll();
   // console.dir(owners);
    return owners as { id: string; name: string }[];
}

export async function assignSprintToTask(taskId: string, sprintId: string): Promise<void> {
    console.log(`====> Assigning task ${taskId} to sprint ${sprintId}`);

    // Update the task with the sprint id
    await (taskRepository as SQLLiteTaskRepository).assignSprint(taskId, sprintId);
    revalidatePath("/grid");
    redirect("/grid");
}

export async function findById(taskId: string): Promise<ITask | null> {
    const t: (ITask | null) = await taskRepository.getById(taskId);
    return t;
}

export async function deleteTask(taskId: string): Promise<void> {
    await taskRepository.delete(taskId);
    await revalidatePath("/plan");
    redirect("/plan");
}

export async function retrieveTasks(): Promise<ITask[] | null> {
    const tasks = await taskRepository.getAll();
    return tasks;
}

// --- Constraint operations -----------------
// export async function retrieveConstraints(): Promise<{ name: string, value: number, project: string }[] | null> {
//     const constraints = await constraintRepository.getAll();
//     return constraints;
//
// }

// -- Sprint operations -----------------

export async function retrieveActiveSprints(): Promise<{ id: string; name: string }[]> {
    const sprints = await sprintRepository.getAll();
    return sprints as { id: string; name: string }[];
}

export async function retriveAllSprintDataById(sprintId: string): Promise<{ id: string; name: string } | null> {
    const sprint = await sprintRepository.getById(sprintId);
    return sprint as { id: string; name: string };
}

// export async function createOrUpdateSprint(sprint: { id?: string; name: string }, data?:any): Promise<void> {
//
//     // Handle the constraints data
//
//     await sprintRepository.upsert(sprint);
//     revalidatePath("/sprints");
//     redirect("/sprints");
// }

// -- Types operations -----------------

export async function createOrUpdateExistingTask(t: ITask) : Promise<ITask> {
    console.log(`###createOrUpdateExistingTask: ${t}"`);
    console.log(`###createOrUpdateExistingTask: ${t.name}, ${t.desc}, loe: ${t.loe} t.id: ${t.id} , t.sprintId: ${t.sprintId} , t.ownerId: ${t.ownerId}`);
    // @ts-ignore
    const startDate = t.startDate ?? new Date();

    // TODO: Calculate end date according to constraints
    // Calculate the end date based on the start date and LOE, Use the constraints information to calculate the end date
    // Call the service using constraints information to calculate the end date
    t.endDate = new Date(startDate.getTime() + (t.loe ?? 0) * 24 * 60 * 60 * 1000);
    const updatedTask : ITask = await taskRepository.upsert( t )
    console.log(`### createOrUpdateExistingTask: ${updatedTask}, ${updatedTask.id} , ${updatedTask.sprintId} , ${updatedTask.ownerId}`);
    return updatedTask;
}


