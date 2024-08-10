// models/task.ts
import { Type, type Static } from "@sinclair/typebox";

// todo ITask interface is probably redundant
export interface ITask {
  id: String;
  name: string;
  desc?: string;
  sprintId?: number;
  ownerId?: number;
  loe?: number;
  startDate?: Date;
  endDate?: Date;
}

const TaskSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  // TODO This translates to string| undefined , which is not what we want we want it to be string | null
  desc: Type.Optional(Type.String()),
  sprintId: Type.Optional(Type.String()),
  ownerId: Type.Optional(Type.String()),
  loe: Type.Optional(Type.Number()),
  startDate: Type.Optional(Type.Date()),
  endDate: Type.Optional(Type.Date()),
});

export type Task = Static<typeof TaskSchema>;
