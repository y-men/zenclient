import {HydrateGlobalStore} from "@/components/hydrate-store";
import ConstraintsDataGrid from "@/app/constraints/constraints-data-grid";


// TODO
//  Consider keeping the server logic related to page with the page and use the use-cases to handle the business logic
//  This will help resonate with Clean Architecture principles
//
export default async function ConstraintsPage() {


    return <>
        <h1>Constraints Page</h1>
        <HydrateGlobalStore>
            <ConstraintsDataGrid/>
        </HydrateGlobalStore>
    </>

}