//import EditableDataGrid from '@/plan/editable-data-grid';
import {retrieveActiveSprints, retrieveTasks, retrieveOwners} from "@/actions";
import {useGlobalStore} from "@/store/global-store";
import {HydrateGlobalStore} from "@/components/hydrate-store";
import EditableDataGrid from "@/app/plan/editable-data-grid";


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
} // Path: src/app/constraints/home-items-container.tsx
