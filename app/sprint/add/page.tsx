import MatrixFormGrid from "@/components/matrix-form-grid";
import {HydrateGlobalStore} from "@/components/hydrate-store";
import EditableDataGrid from "@/components/editable-data-grid";
import {createOrUpdateSprint} from "@/actions";
import { Log } from "@/model/decorators";
import {dlog} from "@/utils";

export default async function AddSprint() {
    const owners = ['Thor', 'Fandral', 'Hogun', 'Volstagg', 'Sif'];
    const deductions = ['Total','Vacations', 'KTLO', 'Misc'];

    const updateSprintData = async (formData:FormData ) => {
        "use server";
        dlog()
        console.dir(`### updateSprintData: ${JSON.stringify(formData,null,2)}`);
        console.log(formData.get('sprintData'));
    }


    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
            <h1>Add Sprint Page</h1>
            <MatrixFormGrid owners={owners} subjects={deductions} matrixFormAction={updateSprintData}/>
        </div>


    )
}