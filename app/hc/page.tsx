import {HydrateGlobalStore} from "@/components/hydrate-store";
import MatrixFormGrid from "@/components/matrix-form-grid";


export default async function HeadcountPage() {
    const themes = [
        'Maintainability & Support',
        'User Interface Revamp',
        'API Enhancements',
        'Database Optimization',
    ];

    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
            <h1>Headcount Page</h1>
            <HydrateGlobalStore>
                <MatrixFormGrid subjects={themes} headerName={"Theme"} totalUnits={1}/>
            </HydrateGlobalStore>
        </div>



    )
} // Path: src/app/constraints/page.tsx
