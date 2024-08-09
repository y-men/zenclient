import EditableDataGrid from "../../components/editable-data-grid"
import {retrieveActiveSprints, retrieveTasks, retrieveOwners} from "@/actions";


export default async function Plan() {
    const rows = await retrieveTasks();
    const activeSprintsFromDb : {id:number, name:string}[] | null = await retrieveActiveSprints();
    const owners :{id:number, name:string}[] | null  = await retrieveOwners();

    console.log("===> Plan <===");
    console.log(`rows: ${rows}`);
    console.log(`activeSprintsFromDb: ${activeSprintsFromDb}`);


    return <div >
                <h1>Plan Page</h1>
                <br/>
                <EditableDataGrid rows={rows}
                          activeSprints={activeSprintsFromDb}
                          owners={owners}

        />
    </div>
} // Path: src/app/constraints/page.tsx
