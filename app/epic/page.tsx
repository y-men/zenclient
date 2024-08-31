import {HydrateGlobalStore} from "@/components/hydrate-store";
import MatrixFormGrid from "@/components/matrix-form-grid";
import {dlog} from "@/utils";
import {redirect} from "next/navigation";
import {WithEpics} from "@/app/epic/with-epics";


export default async function EpicsPage() {


    const addEpicAction = async ( params:any) => {
        "use server"
        dlog()
        redirect("/epic/add")
    }
    //Just a dummy data
    const epics = [{ id: '1', name: 'Epic 1' }, { id: '2', name: 'Epic 2' }, { id: '3', name: 'Epic 3' }];

    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
            <h1>Epics</h1>
            <HydrateGlobalStore>
                <WithEpics>
                    <MatrixFormGrid
                                y={epics}
                                headerName={"Epic"}
                                totalUnits={1}
                                addtionalActions= {[{ name:`Add Epic`, action:addEpicAction }]}
                    />
                </WithEpics>
            </HydrateGlobalStore>
        </div>



    )
} // Path: src/app/constraints/page.tsx

