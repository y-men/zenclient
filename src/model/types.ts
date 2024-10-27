// models/types.ts

import {PrismaClient} from "@prisma/client";


export  interface ISaveQuarterlyPlanData {
  quarterName: string;
  year: string;
  quarter: string;
  firstMonth: string;
  sprintData: any[]; // keeping as any[] for now to match the existing JSON parse
}

export interface ISaveQuarterlyPlanUseCase {
  saveQuarterlyPlan (data: ISaveQuarterlyPlanData): Promise<void>;
}


interface IRepository <T>{
  upsert<T extends { id: string }>(item: T): Promise<T>;
  create(item: T): Promise<T>;
  getAll(): Promise<T[] | null>;
  getById(id: string): Promise< T | null> ;
}

export interface ISprintRepository extends IRepository<ISprint>{}

export interface ITask {
  id: string;
  name: string;
  desc?: string;
  sprint?: ISprint;
  sprintId?: string;
  owner?: IOwner;
  ownerId?: string;
  epic?: IEpic;
  epicId?: string;
  loe?: number;
  startDate?: Date;
  endDate?: Date;
  sequence?: number;
  status?: number;
  actual?: number;
  commited?: number;
  carryover?: string;
  carryoverTaskId?: string;
  carryoverTask?: ITask;
  carriedOverTasks: ITask[];
  dependencies: ITask[];
  dependents: ITask[];
}

export interface IConstraint {
  project: string;
  name: string;
  value: number;
}

export interface ISprint {
  id: string;
  name?: string;
  quarter: IQuarter;
  quarterId: string;
  tasks: ITask[];
  sprintOwnerCommitments: ISprintOwnerCommitment[];
  epicOwnerCommitments: IEpicOwnerCommitment[];
  QuarterOwnerCommitment: IQuarterOwnerCommitment[];
}

export interface IOwner {
  id: string;
  name?: string;
  tasks: ITask[];
  sprintOwnerCommitments: ISprintOwnerCommitment[];
  epicOwnerCommitments: IEpicOwnerCommitment[];
  QuarterOwnerCommitment: IQuarterOwnerCommitment[];
}

export interface ISprintOwnerCommitment {
  sprint: ISprint;
  sprintId: string;
  owner: IOwner;
  ownerId: string;
  commited: number;
}

export interface IEpic {
  id: string;
  name: string;
  priority?: number;
  shortDesc?: string;
  epicDesc?: string;
  tasks: ITask[];
  epicOwnerCommitments: IEpicOwnerCommitment[];
  QuarterOwnerCommitment: IQuarterOwnerCommitment[];
}

export interface IEpicOwnerCommitment {
  epic: IEpic;
  epicId: string;
  owner: IOwner;
  ownerId: string;
  sprint: ISprint;
  sprintId: string;
  sprintWeek: number;
  commited: number;
}

export interface IQuarter {
  id: string;
  year: string;
  quarter: string;
  firstMonth: string;
  displayName?: string;
  sprints: ISprint[];
  QuarterOwnerCommitment: IQuarterOwnerCommitment[];
}

export interface IQuarterOwnerCommitment {
  quarter: IQuarter;
  quarterId: string;
  epic: IEpic;
  epicId: string;
  owner: IOwner;
  ownerId: string;
  sprint: ISprint;
  sprintId: string;
  week: string;
  commited: number;
}


// --- Typescript TypeBox ---
// import { Type, type Static } from "@sinclair/typebox";
//
// //TODO Consider using export interface instead of export type
// // Review the benefits of this approach
// // It is needded for API calls but not nessesary for the front end
// const TaskSchema = Type.Object({
//   id: Type.String(),
//   name: Type.String(),
//   desc: Type.Union([Type.String(), Type.Null()]),
//   sprintId: Type.Union([Type.String(), Type.Null()]),
//   ownerId: Type.Union([Type.String(), Type.Null()]),
//   loe: Type.Union([Type.Number(), Type.Null()]),
//   startDate: Type.Union([Type.Date(), Type.Null()]),
//   endDate: Type.Union([Type.Date(), Type.Null()]),
// });
//
// export type Types = Static<typeof TaskSchema>;
//
// interface IEpic {
//   name: string;
//   shortDesc: string;
//   epicDesc: string;
//   priority: number;
// }
