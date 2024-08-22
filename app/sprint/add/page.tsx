'use client';
import MatrixGrid from "@/components/matrix-grid";
import {HydrateGlobalStore} from "@/components/hydrate-store";
import EditableDataGrid from "@/components/editable-data-grid";
import {createOrUpdateSprint} from "@/actions";

export default async function AddSprint() {
    const owners = ['Thor', 'Fandral', 'Hogun', 'Volstagg', 'Sif'];
    const deductions = ['Total','Vacations', 'KTLO', 'Misc'];

    //TODO Consider using a state -> this will make it client component
    let dataToSave: any[] = [];
    const handleUpdateData = (data: any[] ) => {
        console.log("handleSave");
        console.log(data);
        dataToSave = data;
    }

    const handleSave = (event:any   ) => {
        console.log("handleSave");
        //createOrUpdateSprint( { name:"S2Q2" }, dataToSave);
    }

    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>

            <button className="btn btn-primary mb-2" onClick={handleSave}>
                Save
            </button>
            <MatrixGrid owners={owners} subjects={deductions} onDataUpdate={handleUpdateData}/>
        </div>


    )
}