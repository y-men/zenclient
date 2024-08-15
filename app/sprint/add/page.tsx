import MatrixGrid from "@/components/matrix-grid";
import {HydrateGlobalStore} from "@/components/hydrate-store";
import EditableDataGrid from "@/components/editable-data-grid";

export default async function AddSprint() {
    return (
        <div className="container-fluid d-flex flex-column" style={{height: '100%'}}>
            <h1>Add Sprint</h1>
            <br/>
            <MatrixGrid/>
        </div>


    )
}