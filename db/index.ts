// repositories/ITaskRepository.ts

import { ITask, Task } from "../model/task";
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
  async getById(id: number): Promise< T | null> {
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
export class  SQLLiteOwnerRepository extends PrismaRepository<{ id: number; name: string }> {
    constructor() {
        super("owner");
    }
}


// ----------------- Sprint Repository -----------------
export class SQLLiteSprintRepository {
  constructor() {}

  prisma = new PrismaClient({ log: ["query", "error", "warn", "info"] });
  async getAll(): Promise<{ id: number; name: string }[] | null> {
    const sprints = await this.prisma.sprint.findMany();
    return sprints as { id: number; name: string }[];
  }

  async getById(id: number): Promise<{ id: number; name: string } | null> {
    const sprint = await this.prisma.sprint.findUnique({
      where: {
        id: id,
      },
    });
    return sprint as { id: number; name: string };
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
  getById(id: number): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: number): Promise<void>;
}

export class SQLLiteTaskRepository implements TaskRepository {
  prisma = new PrismaClient({ log: ["query", "error", "warn", "info"] });
  constructor() {
  }


  async assignSprint(taskId: number, sprintId: number): Promise<void> {
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
    return tasks as Task[];
  }

  // Retrive the last task by date
  async getTaskByLastDate(): Promise<Task | null> {
    const task = await this.prisma.task.findFirst({
      orderBy: {
        endDate: 'desc',
      },
    });
    return task as Task;
  }

  async create(task: Task): Promise<Task> {
    const t  = await this.prisma.task.create({
      data: { name: task.name, desc: task.desc, loe: task.loe, startDate: task.startDate, endDate: task.endDate },
    });
    return t as Task;
  }

  async getById(id: number): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: id,
      },
    });
    return task as Task;
  }

  // async findTaskById(id: number): Promise<Task | null> {
  //   const task = await this.prisma.task.findUnique({
  //     where: {
  //       id: id,
  //     },
  //   });
  //   return task as Task;
  // }
  //

  async delete(id: number): Promise<void> {
    await this.prisma.task.delete({
      where: {
        id: id as number,
      },
    });
  }

  async update(task: Task): Promise<Task> {
    const t = await this.prisma.task.update({
      where: { id: task.id },
      data: task,
    });
    return t as Task;
  }
}
