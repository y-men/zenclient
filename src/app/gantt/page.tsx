import {HydrateGlobalStore} from "@/components/hydrate-store";
import GanttContainer from "@/components/gantt-container";
import {retrieveTasks} from "@/actions";

export default async function GanttPage() {
    console.log("Gantt Page");
     const rows = await retrieveTasks();


    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
            <h1>Gantt Page</h1>
            <HydrateGlobalStore>
                <GanttContainer tasks={rows}/>
            </HydrateGlobalStore>

        </div>

    )
}