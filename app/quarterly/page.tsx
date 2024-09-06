
import {retrieveActiveSprints, retrieveQuarterlyPlans, retrieveTasks} from "@/actions";
import {HydrateGlobalStore} from "@/components/hydrate-store";
import EditableDataGrid from "@/components/editable-data-grid";
import DisplayDataGrid from "@/components/display-data-grid";
import Link from "next/link";

export default async function QuarterlyPlans() {

    const rows = await retrieveQuarterlyPlans();

    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
            <h1>Quarterly Plans</h1>
            <Link href="/quarterly/add/">
                <button className="btn btn-primary mb-2">
                    Add Quarterly Plan
                </button>
            </Link>
            <HydrateGlobalStore>
                <DisplayDataGrid columns={[
                    {headerName: "Id", field: "id"},
                    {   headerName: "Starting",
                        field: "firstMonth",
                    }]}
                    rows={rows}
                    routePrefix="quarterly"
                />
            </HydrateGlobalStore>

        </div>
    )
} // Path: src/app/constraints/page.tsx
