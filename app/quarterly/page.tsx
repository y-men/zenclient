import QuarterlyPlanningGrid from "@/components/quarterly-planning-grid";
import {HydrateGlobalStore} from "@/components/hydrate-store";

//Quarterly
export default function QuarterlyPlanPage() {
    return (

        // <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>

            <h1>Quarterly Plan Page</h1>
            <br/>
            <HydrateGlobalStore>
                <QuarterlyPlanningGrid month="Jan" year={2024}/>
            </HydrateGlobalStore>
        </div>
    );

}