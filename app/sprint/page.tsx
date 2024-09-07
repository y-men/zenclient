
// TODO Display list of sprints
// TODO Generalize the page with all the setup and use it in sprints page

import {retrieveActiveSprints, retrieveTasks} from "@/actions";
import {HydrateGlobalStore} from "@/components/hydrate-store";
import EditableDataGrid from "@/components/editable-data-grid";
import DisplayDataGrid from "@/components/display-data-grid";
import Link from "next/link";

export default async function Sprints() {
    const rows = await retrieveActiveSprints();

    /*
    INFO
    Sprint are already defined by the quartely planning, so we can just display them here
    The planner edits the next sprint in terms of capacity provded by the team and the visible constratins
     */

    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
            <h1>Sprints Page</h1>
            <Link href="/sprint/add/">
                <button className="btn btn-primary mb-2">
                    Add Sprint
                </button>
            </Link>
            <HydrateGlobalStore >
                <DisplayDataGrid/>
            </HydrateGlobalStore>

        </div>
    )
} // Path: src/app/constraints/home-items-container.tsx
