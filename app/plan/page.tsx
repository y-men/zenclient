import EditableDataGrid from "../../components/editable-data-grid"
import {retrieveActiveSprints, retrieveTasks, retrieveOwners} from "@/actions";
import {useGlobalStore} from "@/store/global-store";
import {HydrateGlobalStore} from "@/components/hydrate-store";


export default async function Plan() {
    const rows = await retrieveTasks();
    // const activeSprintsFromDb : {id:string, name:string}[] | null = await retrieveActiveSprints();
    // const owners :{id:string, name:string}[] | null  = await retrieveOwners();

    // const owners = useGlobalStore(state => state.owners);
    // const sprints = useGlobalStore(state => state.sprints);
    // const setSprints = useGlobalStore(state => state.setSprints);
    // const setOwners = useGlobalStore(state => state.setOwners);
    // const isSprintsValid = useGlobalStore(state => state.isSprintsValid);
    // const isOwnersValid = useGlobalStore(state => state.isOwnersValid);
    // if( !isSprintsValid) {
    //     const activeSprintsFromDb : {id:string, name:string}[] | null = await retrieveActiveSprints();
    //     setSprints(activeSprintsFromDb);
    // }
    // if( !isOwnersValid) {
    //     const ownersFromDb :{id:string, name:string}[] | null  = await retrieveOwners();
    //     setOwners(ownersFromDb);
    // }



    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
            <h1>Plan Page</h1>
            <br/>
            <HydrateGlobalStore>
                <EditableDataGrid rows={rows}/>
            </HydrateGlobalStore>
            {/*<EditableDataGrid rows={rows}*/}
            {/*                  activeSprints={sprints}*/}
            {/*                  owners={owners}*/}
            {/*/>*/}
        </div>
    )
} // Path: src/app/constraints/page.tsx
