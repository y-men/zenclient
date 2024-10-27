import {HydrateGlobalStore} from "@/components/hydrate-store";
import QuarterlyPlanningGrid from "@/app/quarterly/quarterly-planning-grid";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {SQLLiteQuarterOwnerCommitmentRepository, SQLLiteQuartersRepository, SQLLiteSprintRepository} from "../../../db";
import {saveQuarterlyPlan} from "@/actions";

// The SSR page for the quarterly plan
// eslint-disable-next-line import/no-anonymous-default-export,react/display-name
export default () => {
    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>

            <h1>Quarterly Plan Page</h1>
            <br/>
            <HydrateGlobalStore>
                <QuarterlyPlanningGrid
                    quarter="Q1"
                    year={2024}
                    action={saveQuarterlyPlan}
                />
            </HydrateGlobalStore>
        </div>
    );
}

