const tasks = [
    { id: 0, title: "Learn Prisma", desc: "IN_PROGRESS" },
    { id: 1, title: "Learn Next.js", desc: "TODO" },
];

export async function findTaskById(id: number): Promise<{ id: number; title: string; desc: string | null } | null> {
    return tasks[id];
}

export async function createTask(title: string, desc: string | null): Promise<{ id: number; title: string; desc: string | null }> {
    const newTask = { id: tasks.length + 1, title, desc: desc!};
    tasks.push(newTask);
    return newTask;
}
    

export async function retrieveTasks(): Promise<{ id: number; title: string; desc: string | null }[]>{
    console.log("#### Retrieving tasks");
    console.log(tasks);
    return tasks;
}
