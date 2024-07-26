import { findById } from "@/actions"
import { notFound } from "next/navigation"; 

// todo Task infterface and model should be in a shared package    

export type TaskParams = {
  params: { id: string; title: string; desc: string };
  searchParams: string;
};

export default async function ViewTaskData(props: TaskParams) {
  const task: { id: number, name:string, desc?:string   } | null =
    await findById( parseInt(props.params.id) );
   
  if (!task) return notFound();
  return (
    <div>
      <h1>{task?.name}</h1>
      <p>{task?.desc}</p>
    </div>
  );
}
