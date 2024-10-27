
import Link from "next/link";
import React from "react";

export interface Task {
  id: number | string;
  title: string;
  desc: string | null;
}

export default function GridTask(task: Task) {
  //const router = useRouter();
  return (
    <div key={task.id}>
      <Link href={`/grid/${task.id}`}>
        {" "}
        {task.title} | {task.desc}{" "}
      </Link>
      |{" "}
      <a className="fake-link" >
        delete
      </a>
    </div>
  );
}
