// models/task.ts
import { Type, type Static } from "@sinclair/typebox";

// // todo ITask interface is probably redundant
// export interface ITask {
//   id: String;
//   name: string;
//   desc?: string;
//   sprintId?: number;
//   ownerId?: number;
//   loe?: number;
//   startDate?: Date;
//   endDate?: Date;
// }
/*
Following is the schema for the Task model. It is used to validate the data that is being passed to the Task model.
The schema is driven by prisma data model,used to validate the data that is being passed to the Task model.
{
  id: string;
  name: string;
  desc: string | null;
  sprintId: string | null;
  ownerId: string | null;
  loe: number | null;
  startDate: Date | null;
  endDate: Date | null;
  sequence: number | null;
}

 */


// const TaskSchema = Type.Object({
//   id: Type.String(),
//   name: Type.String(),
//   desc: Type.Optional(Type.String()),
//   sprintId: Type.Optional(Type.String()),
//   ownerId: Type.Optional(Type.String()),
//   loe: Type.Optional(Type.Number()),
//   startDate: Type.Optional(Type.Date()),
//   endDate: Type.Optional(Type.Date()),
// });
const TaskSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  desc: Type.Union([Type.String(), Type.Null()]),
  sprintId: Type.Union([Type.String(), Type.Null()]),
  ownerId: Type.Union([Type.String(), Type.Null()]),
  loe: Type.Union([Type.Number(), Type.Null()]),
  startDate: Type.Union([Type.Date(), Type.Null()]),
  endDate: Type.Union([Type.Date(), Type.Null()]),
});

export type Task = Static<typeof TaskSchema>;
