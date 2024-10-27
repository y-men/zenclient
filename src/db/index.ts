
import { PrismaClient } from "@prisma/client";
import {IQuarter, IQuarterOwnerCommitment, ISprint, ISprintRepository, ITask} from "@/model/types";
import { injectable, inject } from 'inversify';
import { TYPES } from '@/model/container';


/**
 * A generic repository for Prisma
 */
@injectable()
abstract class PrismaRepository <T> {
  entity = "";
  prisma = new PrismaClient({ log: ["query", "error", "warn", "info"] });

  constructor() {
    this.entity = this.getTargetEntity();
  }

  abstract getTargetEntity(): any;

  async upsert<T extends { id: string }>(item: T): Promise<T> {
    // @ts-ignore
    const updatedItem = await ( this.prisma[this.entity] as PrismaClient).upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
    return updatedItem as T;
  }

  async create(item: T): Promise<T> {
    // @ts-ignore
    const createdItem = await ( this.prisma[this.entity] as PrismaClient).create({
      data: item,
    });
    return createdItem as T;
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

@injectable()
export class SQLLiteSprintRepository extends PrismaRepository<ISprint> implements ISprintRepository {
  getTargetEntity(): any {
    return "sprint";
  }
}

export class SQLLiteQuartersRepository extends PrismaRepository<IQuarter> {
  //  constructor() {
  //   super("quarter");
  // }
    getTargetEntity(): any {
        return "quarter";
    }
}

export class SQLLiteQuarterOwnerCommitmentRepository extends PrismaRepository<IQuarterOwnerCommitment> {
    // constructor() {
    //     super("quarterOwnerCommitment");
    // }

    getTargetEntity(): any {
        return "quarterOwnerCommitment";
    }

  async getCommitmentsByQuarter(quarterId: string): Promise<IQuarterOwnerCommitment[] | null> {
      "use server"
    const commitments = await this.prisma.quarterOwnerCommitment.findMany({
      where: {
        quarterId: quarterId,
      },
    });
    return commitments as IQuarterOwnerCommitment[];
  }

  //@ts-ignore
  async upsert(quarterOwnerCommitment: IQuarterCommitment): Promise<IQuarterCommitment> {
    const qoc = await this.prisma.quarterOwnerCommitment.upsert({
      where: {
        ownerId_week_epicId: {
          ownerId: quarterOwnerCommitment.ownerId,
          week: quarterOwnerCommitment.week,
          epicId: quarterOwnerCommitment.epicId
        }
      },
      update: quarterOwnerCommitment,
      // @ts-ignore
      create: quarterOwnerCommitment
    });
    return qoc as IQuarterOwnerCommitment
  }
}

// --------------------------------------------------------------------------------------------



export class SQLLiteEpicRepository extends PrismaRepository<{
  id: string;
  name: string
  shortDesc?: string
  epicDesc?: string
  priority?: number
}> {
    // constructor() {
    //     super("epic");
    // }


  getTargetEntity(): any {
    return "epic";
  }

  async create(epic: { id?: string; name: string; shortDesc?: string; epicDesc?: string; priority?: number }): Promise<{ id: string; name: string; shortDesc?: string; epicDesc?: string; priority?: number }> {
        const e = await this.prisma.epic.create({
            data: epic,
        });
        return e as { id: string; name: string; shortDesc?: string; epicDesc?: string; priority?: number };
    }

    // async upsert(epic: { id?: string; name: string; shortDesc?: string; epicDesc?: string; priority?: number }): Promise<{ id: string; name: string; shortDesc?: string; epicDesc?: string; priority?: number }> {
    //     const e = await this.prisma.epic.upsert({
    //         where: { id: epic.id },
    //         update: { name: epic.name, shortDesc: epic.shortDesc, epicDesc: epic.epicDesc, priority: epic.priority },
    //         create: { name: epic.name, shortDesc: epic.shortDesc, epicDesc: epic.epicDesc, priority: epic.priority },
    //     });
    //     return e as { id: string; name: string; shortDesc?: string; epicDesc?: string; priority?: number };
    // }
}



// --- Owner Repository -----------------
export class  SQLLiteOwnerRepository extends PrismaRepository<{ id: string; name: string }> {
    // constructor() {
    //     super("owner");
    // }
    getTargetEntity(): any {
        return "owner";
    }
}




// ----------------- SprintOwnerCommitment Repository -----------------
export class SQLLiteSprintOwnerCommitmentRepository extends PrismaRepository<{ id: string; sprintId: string; ownerId: string; units: number }> {
    // constructor() {
    //     super("sprintOwnerCommitment");
    // }
    getTargetEntity(): any {
        return "sprintOwnerCommitment";
    }

  // @ts-ignore
  async upsert(sprintOwnerCommitment: { sprintId: string; ownerId: string; commited: number }):
      Promise<{ id: string; sprintId: string; ownerId: string; commited: number }> {
    const s = await this.prisma.sprintOwnerCommitment.upsert({

  //Use unique composite key constraint
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

// ----------------- Types Repository -----------------

export interface TaskRepository {
  getAll(): Promise<ITask[] | null>;
  getById(id: string): Promise<ITask | null>;
  create(task: ITask): Promise<ITask>;
  update(task: ITask): Promise<ITask>;
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

  async getAll(): Promise<ITask[] | null> {
    const tasks = await this.prisma.task.findMany();
    // @ts-ignore
    return tasks as Types[];
  }

  // Retrive the last task by date
  async getTaskByLastDate(): Promise<ITask | null> {
    const task = await this.prisma.task.findFirst({
      orderBy: {
        endDate: 'desc',
      },
    });
    // @ts-ignore
    return task as Types;
  }

  // Extend somewhat on the "classic" upsert method
  async upsert(task: ITask): Promise<ITask> {
    console.log(`### upsert: ${task}, ${task.name}, ${task.desc}, ${task.loe} t.id: ${task.id} , t.sprintId: ${task.sprintId} , t.ownerId: ${task.ownerId}`);
    let t;
    if (task.id && task.id != '') {
      t = await this.prisma.task.update({
        where: {id: task.id},
        // @ts-ignore
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
    return t as ITask;
  }

  async create(task: ITask): Promise<ITask> {
    const t  = await this.prisma.task.create({
      data: { name: task.name, desc: task.desc, loe: task.loe, startDate: task.startDate, endDate: task.endDate },
    });

    // @ts-ignore
    return t as Types;
  }

  async getById(id: string): Promise<ITask | null> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: id,
      },
    });
    // @ts-ignore
    return task as Types;
  }


  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: {
        id: id
      },
    });
  }

  async update(task: ITask): Promise<ITask> {
    const t = await this.prisma.task.update({
      where: { id: task.id },
      // @ts-ignore
      data: task,
    });
    return t as ITask;
  }
}
