"use server";
import {redirect} from "next/navigation";
import {ITask} from "@/model/task";
import {
    TaskRepository,
    SQLLiteTaskRepository,
    SQLLiteSprintRepository, SQLLiteConstraintRepository,
} from "@/db";
import {revalidatePath} from "next/cache";
import {number} from "prop-types";

const taskRepository: TaskRepository = new SQLLiteTaskRepository();
const sprintRepository: SQLLiteSprintRepository = new SQLLiteSprintRepository();
const constraintRepository: SQLLiteConstraintRepository = new SQLLiteConstraintRepository();


export async function retrieveConstraints(): Promise<{ name: string, value: number, project: string }[] | null> {
    const constraints = await constraintRepository.getAll();
    return constraints;

}
/**
 * Handle additional information nedded for calculation of constraints values
 * @param formData
 */
export async function updateConstraintData(formData: FormData):Promise<void> {
    let promises: Promise<{ name: string, value: number, project: string }>[] = [];
    Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(`>> ${key}, ${value}  `);
        const p: Promise<{ name: string; value: number; project: string }> =
            constraintRepository.upsert({name: key, value: parseInt(value as string, 10), project: "ALL"})
        promises.push(p);

    })
    Promise.allSettled(promises!).then( () => {
        console.log("All constraints updated");
    })


    // todo Redirect or provide feedback after submission
}

export async function findById(taskId: number): Promise<ITask | null> {
    const t: (ITask | null) = await taskRepository.getById(taskId);
    return t;
}

export async function deleteTask(taskId: number): Promise<void> {
    await taskRepository.delete(taskId);
    revalidatePath("/grid");
    redirect("/grid");
}

export async function retrieveTasks(): Promise<ITask[] | null> {
    const tasks = await taskRepository.getAll();
    return tasks;
}

export async function retrieveActiveSprints(): Promise<{ id: number; name: string }[]> {
    const sprints = await sprintRepository.getAll();
    return sprints as { id: number; name: string }[];
}

export async function addTaskAfterCurrent(task: ITask) {
    // Sort tasks by start date
    // add to next date
    // update other tasks
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

    //TODO Caluculate the start data bsed on previous task end date
    const startDate = new Date();

    // Calculate the end date based on the start date and LOE, Use the constraints information to calculate the end date
    // Call the service using constraints information to calculate the end date
    const endDate = new Date(startDate.getTime() + loe * 24 * 60 * 60 * 1000);
    const task = await taskRepository.create({
        name: title,
        desc: desc,
        loe: loe,
        startDate: startDate,
        endDate: endDate,
        id: -1
    });
    // Update the sequence number of the task ( == id ) for creating with form
    revalidatePath("/grid");
    redirect("/grid");
}
