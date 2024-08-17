// models/task.ts
import { Type, type Static } from "@sinclair/typebox";

//TODO Consider using export interface instead of export type
// Review the benefots of this approach
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
