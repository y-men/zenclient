import {HydrateGlobalStore} from "@/components/hydrate-store";
import MatrixFormGrid from "@/components/matrix-form-grid";


export default async function EpicsPage() {
    const themes = [
        'Maintainability & Support',
        'User Interface Revamp',
        'API Enhancements',
        'Database Optimization',
    ];

    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
            <h1>Epics</h1>
            <HydrateGlobalStore>
                <MatrixFormGrid y={themes} headerName={"Epic"} totalUnits={1}/>
            </HydrateGlobalStore>
        </div>



    )
} // Path: src/app/constraints/page.tsx
