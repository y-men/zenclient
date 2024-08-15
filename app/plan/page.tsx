import EditableDataGrid from "../../components/editable-data-grid"
import {retrieveActiveSprints, retrieveTasks, retrieveOwners} from "@/actions";
import {useGlobalStore} from "@/store/global-store";
import {HydrateGlobalStore} from "@/components/hydrate-store";


export default async function Plan() {
    const rows = await retrieveTasks();

    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
            <h1>Plan Page</h1>
            <br/>
            <HydrateGlobalStore>
                <EditableDataGrid rows={rows}/>
            </HydrateGlobalStore>
        </div>
    )
} // Path: src/app/constraints/page.tsx
