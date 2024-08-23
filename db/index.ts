// repositories/ITaskRepository.ts

import { Task } from "../model/task";
import { PrismaClient } from "@prisma/client";


//todo Add interfaces for repositories
//todo Migrate the classes use the "abstract" Prisma repository
/**
 * A generic repository for Prisma
 */
abstract class PrismaRepository <T> {
  entity = "";
  prisma = new PrismaClient({ log: ["query", "error", "warn", "info"] });

  constructor( entity:string) {
    this.entity = entity;
  }

  async getAll(): Promise<T[] | null> {
    // @ts-ignore
    const items = await ( this.prisma[this.entity] as PrismaClient).findMany();
    return items as any[];
  }
  async getById(id: string): Promise< T | null> {
    // @ts-ignore
    const owner = await ( this.prisma[this.entity ] as PrismaClient ).findUnique({
      where: {
        id: id,
      },
    });
    return owner as T;
  }
}


// --- Owner Repository -----------------
export class  SQLLiteOwnerRepository extends PrismaRepository<{ id: string; name: string }> {
    constructor() {
        super("owner");
    }
}


// ----------------- Sprint Repository -----------------
export class SQLLiteSprintRepository extends PrismaRepository<{ id: string; name: string }> {
  constructor() {
    super("sprint");
  }

  async create(sprint: { id: string; name: string }): Promise<{ id: string; name: string }> {
    const s = await this.prisma.sprint.create({
      data: sprint,
    });
    return s as { id: string; name: string };
  }
  async upsert(sprint: { id?: string; name: string }): Promise<{ id: string; name: string }> {
    const s = await this.prisma.sprint.upsert({
      where: { id: sprint.id },
      update: { name: sprint.name },
      create: { name: sprint.name },
    });
    return s as { id: string; name: string };
  }
}

// ----------------- SprintOwnerCommitment Repository -----------------
export class SQLLiteSprintOwnerCommitmentRepository extends PrismaRepository<{ id: string; sprintId: string; ownerId: string; units: number }> {
    constructor() {
        super("sprintOwnerCommitment");
    }

  async upsert(sprintOwnerCommitment: { sprintId: string; ownerId: string; commited: number }):
      Promise<{ id: string; sprintId: string; ownerId: string; commited: number }> {
    const s = await this.prisma.sprintOwnerCommitment.upsert({

// Use unique composite key constraint
      where: {
        sprintId_ownerId: {
          sprintId: sprintOwnerCommitment.sprintId,
          ownerId: sprintOwnerCommitment.ownerId
        }
      },
      update: {commited: sprintOwnerCommitment.commited},
      create: {
        sprintId: sprintOwnerCommitment.sprintId,
        ownerId: sprintOwnerCommitment.ownerId,
        commited: sprintOwnerCommitment.commited
      },
    });
    return s as { id: string; sprintId: string; ownerId: string; commited: number };
  }
}


// ----------------- Constraint Repository -----------------

export  class SQLLiteConstraintRepository {
    constructor() {}

    prisma = new PrismaClient({ log: ["query", "error", "warn", "info"] });
    async getAll(): Promise<{ name: string, value:number, project:string }[] | null> {
        const constraints = await this.prisma.constraint.findMany();
        return constraints as { name: string, value:number, project:string }[]
    }
    // @ts-ignore
  async getAllGlobal(): Promise<{ name: string, value:number, project:string }[] | null> {
    const constraints = await this.prisma.constraint.findMany(
        {
          where: {
            project: "ALL",
          }
        });
    // todo Create IConstraint interface
    return constraints as { name: string, value:number, project:string }[];

  }

  // @ts-ignore
  async upsert(constraint: { name: string, value: number, project: string }): Promise<{  name: string, value: number, project: string }> {
    const c = await this.prisma.constraint.upsert({
      where: { name_project: { name: constraint.name, project: "ALL" } },
      update: { value: constraint.value},
      create: { name: constraint.name, value: constraint.value, project: "ALL" }
    });
    return c as { name: string, value: number, project: string };
  }


  async create(constraint: { name: string, value: number, project: string }): Promise<{ name: string, value: number, project: string }> {
    const c = await this.prisma.constraint.create({
      data: constraint,
    });
    return c as { id: number; name: string, value: number, project: string };
  }
}

// ----------------- Task Repository -----------------

export interface TaskRepository {
  getAll(): Promise<Task[] | null>;
  getById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
}

export class SQLLiteTaskRepository implements TaskRepository {
  prisma = new PrismaClient({ log: ["query", "error", "warn", "info"] });
  constructor() {
  }


  async assignSprint(taskId: string, sprintId: string): Promise<void> {
    await this.prisma.task.update({
      where: { id: taskId },
      data: { sprintId: sprintId },
    }).catch((e) => {

      // Update with the sprintId=null
      this.prisma.task.update({
        where: { id: taskId },
        data: { sprintId: null },
      });
    });
  }
  // Initial data for Sprint table

  async getAll(): Promise<Task[] | null> {
    const tasks = await this.prisma.task.findMany();
    // @ts-ignore
    return tasks as Task[];
  }

  // Retrive the last task by date
  async getTaskByLastDate(): Promise<Task | null> {
    const task = await this.prisma.task.findFirst({
      orderBy: {
        endDate: 'desc',
      },
    });
    // @ts-ignore
    return task as Task;
  }

  // Extend somewhat on the "classic" upsert method
  async upsert(task: Task): Promise<Task> {
    console.log(`### upsert: ${task}, ${task.name}, ${task.desc}, ${task.loe} t.id: ${task.id} , t.sprintId: ${task.sprintId} , t.ownerId: ${task.ownerId}`);
    let t: Task;
    if (task.id && task.id != '') {
      t = await this.prisma.task.update({
        where: {id: task.id},
        data: task,
      });
    } else {
      t = await this.prisma.task.create({
        data: {
          name: task.name,
          desc: task.desc,
          loe: task.loe,
          sprintId: task.sprintId, //== '0'? null: task.sprintId,
          ownerId: task.ownerId, //== '0'? null: task.ownerId,
          startDate: task.startDate,
          endDate: task.endDate,
        },
      });
    }
    // @ts-ignore
    return t;
  }

  async create(task: Task): Promise<Task> {
    const t  = await this.prisma.task.create({
      data: { name: task.name, desc: task.desc, loe: task.loe, startDate: task.startDate, endDate: task.endDate },
    });

    // @ts-ignore
    return t as Task;
  }

  async getById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: id,
      },
    });
    // @ts-ignore
    return task as Task;
  }


  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: {
        id: id
      },
    });
  }

  async update(task: Task): Promise<Task> {
    const t = await this.prisma.task.update({
      where: { id: task.id },
      // @ts-ignore
      data: task,
    });
    return t as Task;
  }
}
