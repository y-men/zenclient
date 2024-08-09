"use client"
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import {useState} from "react"; // Optional Theme applied to the Data Grid
import {GridActionButton} from "@/components/grid-action-submit";
import {EditableGridActionButton} from "@/components/grid-action-submit";

const EditableDataGrid = (
    {rows, activeSprints, owners }: { rows: any[] | null,
        activeSprints?: { id: number; name: string }[],
        owners?: { id: number; name: string }[]

    },
) =>{

    //todo Do we want to use state or update directly ?
    const [rowData, setRowData] = useState(rows);
    activeSprints = activeSprints ? activeSprints : [];
    owners = owners ? owners : [];
    console.log("----------------------------------------------");
    console.log("Rows", rows);
    console.log("Active sprints", activeSprints);
    console.log("Owners", owners);

    const gridOptions = {
        columnDefs: [
            {field: "actions",
                headerName: " ",
                cellRenderer: EditableGridActionButton
            },
            {field: "id", name: "ID"},
            {field: "name", name: "Title"},
            {
                field: "sprintId",
                name: "Sprint",
                editable: true,
                cellRenderer: "agSelectCellRenderer",
                cellEditor: "agSelectCellEditor",
                cellEditorParams: {
                    values:  activeSprints!.map((sprint: { id: number; name: string }) => sprint.name)
               },
                valueParser: (params: any) =>  activeSprints.find((sprint) => sprint.name === params.newValue)?.id ,
                valueFormatter: (params: any) => activeSprints.find(( sprint) => Number(sprint.id) === Number(params.value))?.name
            },
            {field: "desc", name: "Description"},
            {
                field: "ownerId",
                name: "Owner",
                editable: true,
                cellRenderer: "agSelectCellRenderer",
                cellEditor: "agSelectCellEditor",

                // todo Generalize this drop down editor
                cellEditorParams: {
                    values:  owners!.map((owner: { id: number; name: string }) => owner.name)
                },
                valueParser: (params: any) =>  owners!.find((owner) => owner.name === params.newValue)?.id ,
                valueFormatter: (params: any) => owners!.find(( owner) => Number(owner.id) === Number(params.value))?.name

            },
            {field: "loe", name: "LOE"},
            {field: "startDate", name: "Start Date"},
            {field: "endDate", name: "End Date"},
        ],
        rowData: rowData,
        //rows,
        defaultColDef: {
            flex: 1,
            minWidth: 100,
            filter: true,
            sortable: true,
            resizable: true
        },
        singleClickEdit: true,
        rowSelection: 'single',
        onGridReady: (params:any) => {
            params.api.sizeColumnsToFit();
        }
    };

    return <div className="ag-theme-quartz" style={{ height: 400, width: '100%' }}>
            <AgGridReact
                // @ts-ignore
                gridOptions ={gridOptions}></AgGridReact>
        </div>;

}

export default EditableDataGrid;