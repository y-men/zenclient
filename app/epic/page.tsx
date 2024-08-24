import {HydrateGlobalStore} from "@/components/hydrate-store";
import MatrixFormGrid from "@/components/matrix-form-grid";
import {dlog} from "@/utils";
import {redirect} from "next/navigation";


export default async function EpicsPage() {

    const themes = [
        'Maintainability & Support',
        'User Interface Revamp',
        'API Enhancements',
        'Database Optimization',
    ];

    const addEpicAction = async ( params:any) => {
        "use server"
        dlog()
        redirect("/epic/add")
    }

    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
            <h1>Epics</h1>
            <HydrateGlobalStore>
                <MatrixFormGrid y={themes}
                                headerName={"Epic"}
                                totalUnits={1}
                                addtionalActions= {[{ name:`Add Epic`, action:addEpicAction }]}
                />
            </HydrateGlobalStore>
        </div>



    )
} // Path: src/app/constraints/page.tsx
