import {HydrateGlobalStore} from "@/components/hydrate-store";
import QuarterlyPlanningGrid from "@/app/quarterly/add/quarterly-planning-grid";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {SQLLiteQuartersRepository} from "@/db";


//Quarterly
// The SSR page for the quarterly plan
export default function AddQuarterlyPlanPage() {

    //TODO Maybe here is a better place for actions related to pager
    const saveQuarterlyPlan = async (formData: FormData) => {
        "use server"
        console.log("===> saveQuarterlyPlan <===");
        console.dir(formData);
        /*
[
    {
      name: 'sprintData',
      value: '[{"id":"1","name":"Thor","week2":"0ed582f3-2615-4991-b70e-b1395d2d3526","week3":"89f372a8-d918-4655-bfea-bc98a3e61614","week4":"0ed582f3-2615-4991-b70e-b1395d2d3526","week6":"26a91d65-4f4a-4c9a-89b3-7953ad3f6634"},{"id":"2","name":"Fandral"},{"id":"3","name":"Hogun"},{"id":"4","name":"Volstagg","week7":"0ed582f3-2615-4991-b70e-b1395d2d3526"},{"id":"5","name":"Sif"},{"id":"0","name":"N/A"}]'
    },
    { name: 'quarterName', value: 'Q1-2024' }
  ]         */

        // Add the quarterly plan
        const quarterlyRepositoy = new SQLLiteQuartersRepository();
        formData.get("quarterName") && (await quarterlyRepositoy.create({
            id: formData.get("quarterName") as string,
            year: formData.get("year") as string,
            quarter: formData.get("quarter") as string,
            firstMonth: formData.get("firstMonth") as string
        }));

        // Add the commitments

        // Add sprints and sprint connections

        revalidatePath("/quarterly");
        redirect("/quarterly");
    }


    return (
        // <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>

            <h1>Quarterly Plan Page</h1>
            <br/>
            <HydrateGlobalStore>
                <QuarterlyPlanningGrid
                    month="Jan"
                    year={2024}
                    action={saveQuarterlyPlan}
                />
            </HydrateGlobalStore>
        </div>
    );

}