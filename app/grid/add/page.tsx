import { createTask } from "@/actions";
import { AddTaskSubmit } from "@/components/grid-action-submit";

export default function AddTaskPage() {
  // async function createTask(formData: FormData) {
  //   "use server";
  //   const title = formData.get("title") as string;
  //   const desc = formData.get("desc") as string;

  //   // TODO: introduce a repository pattern here
  //   const task = createTaskDb(title, desc);
  //   console.log(task);
  //   redirect("/grid/");
  // }

  return (
    <div>
      <h1>Add Task</h1>
      <form className="w-1/2" action={createTask}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="w-full">
              Title
            </label>
            <input
                name="title"
                className="border rounded p-2 w-full"
                id="title"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="desc" className="w-full">
              Description
            </label>
            <textarea
                name="desc"
                className="border rounded p-2 w-full"
                id="desc"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="loe" className="w-full">
              Effort(days)
            </label>
            <input
                type="number"
                name="loe"
                className="border rounded p-2 w-full"
                id="loe"
            />
          </div>

          {/* <button type="submit" className="btn">
            Create
          </button> */}
          <AddTaskSubmit/>
        </div>
      </form>
    </div>
  );
}
