import { findById } from "../../../actions"
import { notFound } from "next/navigation"; 

// todo Types infterface and model should be in a shared package

export type TaskParams = {
  params: { id: string; title: string; desc: string };
  searchParams: string;
};

export default async function ViewTaskData(props: TaskParams) {
    // @ts-ignore
    const task: { id: string, name:string, desc?:string   } | null =
    await findById( props.params.id);
   
  if (!task) return notFound();
  return (
    <div>
      <h1>{task?.name}</h1>
      <p>{task?.desc}</p>
    </div>
  );
}
