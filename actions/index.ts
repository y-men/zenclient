
"use server";
import {redirect, usePathname} from "next/navigation";
import { Task} from "@/model/task";
import {
    TaskRepository,
    SQLLiteTaskRepository,
    SQLLiteSprintRepository,
    SQLLiteConstraintRepository,
    SQLLiteOwnerRepository, SQLLiteEpicRepository, SQLLiteQuartersRepository
} from "@/db";
import {revalidatePath} from "next/cache";
import {number} from "prop-types";
import {Log} from "@/model/decorators";
import {dlog} from "@/utils";

// Todo use injection
const taskRepository: SQLLiteTaskRepository = new SQLLiteTaskRepository();
const sprintRepository: SQLLiteSprintRepository = new SQLLiteSprintRepository();
const constraintRepository: SQLLiteConstraintRepository = new SQLLiteConstraintRepository();
const ownersRepository: SQLLiteOwnerRepository = new SQLLiteOwnerRepository();
const epicRepository: SQLLiteEpicRepository = new SQLLiteEpicRepository();
const quarterRepository: SQLLiteQuartersRepository = new SQLLiteQuartersRepository()

// TODO: refactor: Consider moving the form oprations to /app pages
// TODO: refactor: Consider moving to /actions/forms ....
// -- Image operations -----------------

export async function getRandomImage() {
    const res = await fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.PUBLIC_UNSPLASH_ACCESS_KEY}`);
    if (!res.ok) {
        throw new Error("Failed to fetch image from Unsplash");
    }
    return await res.json();
}


// -- Form operations -----------------
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
export async function updateConstraintData(formData: FormData): Promise<void> {
    let promises: Promise<{ name: string, value: number, project: string }>[] = [];
    Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(`>> ${key}, ${value}  `);
        const p: Promise<{ name: string; value: number; project: string }> =
            constraintRepository.upsert({name: key, value: parseInt(value as string, 10), project: "ALL"})
        promises.push(p);

    })
    Promise.allSettled(promises!).then(() => {
        console.log("All constraints updated");
    })

    // todo Redirect or provide feedback after submission
}

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


// -- Retrieve operations -----------------

export async function retrieveQuarterlyPlans(): Promise<{ id: string, name: string, firstMonth: string  }[]> {
    console.log("====> Retrieving QuarterlyPlans");
    const quarters = await quarterRepository.getAll();
    console.dir( quarters)
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

export async function findById(taskId: string): Promise<Task | null> {
    const t: (Task | null) = await taskRepository.getById(taskId);
    return t;
}

export async function deleteTask(taskId: string): Promise<void> {
    await taskRepository.delete(taskId);
    await revalidatePath("/plan");
    redirect("/plan");
}

export async function retrieveTasks(): Promise<Task[] | null> {
    const tasks = await taskRepository.getAll();
    return tasks;
}

// --- Constraint operations -----------------
export async function retrieveConstraints(): Promise<{ name: string, value: number, project: string }[] | null> {
    const constraints = await constraintRepository.getAll();
    return constraints;

}





// -- Sprint operations -----------------

export async function retrieveActiveSprints(): Promise<{ id: string; name: string }[]> {
    const sprints = await sprintRepository.getAll();
    return sprints as { id: string; name: string }[];
}

export async function retriveAllSprintDataById(sprintId: string): Promise<{ id: string; name: string } | null> {
    const sprint = await sprintRepository.getById(sprintId);
    return sprint as { id: string; name: string };
}

export async function createOrUpdateSprint(sprint: { id?: string; name: string }, data?:any): Promise<void> {

    // Handle the constraints data

    await sprintRepository.upsert(sprint);
    revalidatePath("/sprints");
    redirect("/sprints");
}

// -- Task operations -----------------

export async function createOrUpdateExistingTask(t: Task) : Promise<Task> {
    console.log(`###createOrUpdateExistingTask: ${t}"`);
    console.log(`###createOrUpdateExistingTask: ${t.name}, ${t.desc}, loe: ${t.loe} t.id: ${t.id} , t.sprintId: ${t.sprintId} , t.ownerId: ${t.ownerId}`);
    // @ts-ignore
    const startDate = t.startDate ?? new Date();

    // TODO: Calculate end date according to constraints
    // Calculate the end date based on the start date and LOE, Use the constraints information to calculate the end date
    // Call the service using constraints information to calculate the end date
    t.endDate = new Date(startDate.getTime() + (t.loe ?? 0) * 24 * 60 * 60 * 1000);
    const updatedTask : Task = await taskRepository.upsert( t )
    console.log(`### createOrUpdateExistingTask: ${updatedTask}, ${updatedTask.id} , ${updatedTask.sprintId} , ${updatedTask.ownerId}`);
    return updatedTask;
}


