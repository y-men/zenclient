// models/task.ts
import { Type, type Static } from "@sinclair/typebox";

// todo ITask interface is probably redundant
export interface ITask {
  id: number;
  name: string;
  desc?: string;
  sprintId?: number;
  ownerId?: number;
  loe?: number;
  startDate?: Date;
  endDate?: Date;
}

const TaskSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  desc: Type.Optional(Type.String()),
  sprintId: Type.Optional(Type.Number()),
    ownerId: Type.Optional(Type.Number()),
  loe: Type.Optional(Type.Number()),
  startDate: Type.Optional(Type.Date()),
  endDate: Type.Optional(Type.Date()),
});

export type Task = Static<typeof TaskSchema>;
