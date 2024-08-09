"use client"
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";// Optional Theme applied to the Data Grid
import { useState } from "react";
import { EditableGridActionButton } from "@/components/grid-action-submit";
import { Task } from "@/model/task";

const EditableDataGrid = (
    { rows, activeSprints, owners }: { rows: any[] | null, activeSprints?: { id: number; name: string }[], owners?: { id: number; name: string }[] },
) => {

    const [rowData, setRowData] = useState(rows);
    activeSprints = activeSprints ? activeSprints : [];
    owners = owners ? owners : [];
    console.log("----------------------------------------------");
    console.log("Rows", rows);
    console.log("Active sprints", activeSprints);
    console.log("Owners", owners);

    function handleAddRowAtAfterIndex(params: any) {
        console.log("Adding row after index", params.rowIndex);
        const newRow: Task = {
            id: 0,
            name: "",
            desc: "",
            sprintId: 0,
            ownerId: 0,
            loe: 0,
            startDate: params.data?.endDate,
            endDate: new Date()
        };
        const updatedRows = [...rowData!];
        updatedRows.splice(params.node.rowIndex + 1, 0, newRow); // Insert the new row after the selected row
        setRowData(updatedRows);
    }

    const columnDefs = [
        {
            field: "actions",
            headerName: " ",
            cellRenderer: (params: any) => (
                <EditableGridActionButton
                    onClick={{
                        add: () => handleAddRowAtAfterIndex(params),
                        carryonver: (params: any) => console.log("Carryover")
                    }}
                    {...params}
                />
            )
        },
        { field: "id", name: "ID" },
        { field: "name", name: "Title" },
        {
            field: "sprintId",
            name: "Sprint",
            editable: true,
            cellRenderer: "agSelectCellRenderer",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: activeSprints!.map((sprint: { id: number; name: string }) => sprint.name)
            },
            valueParser: (params: any) => activeSprints.find((sprint) => sprint.name === params.newValue)?.id,
            valueFormatter: (params: any) => activeSprints.find((sprint) => Number(sprint.id) === Number(params.value))?.name
        },
        { field: "desc", name: "Description" },
        {
            field: "ownerId",
            name: "Owner",
            editable: true,
            cellRenderer: "agSelectCellRenderer",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: owners!.map((owner: { id: number; name: string }) => owner.name)
            },
            valueParser: (params: any) => owners!.find((owner) => owner.name === params.newValue)?.id,
            valueFormatter: (params: any) => owners!.find((owner) => Number(owner.id) === Number(params.value))?.name
        },
        { field: "loe", name: "LOE" },
        { field: "startDate", name: "Start Date" },
        { field: "endDate", name: "End Date" },
    ];

    return (
        <div className="ag-theme-quartz" style={{ height: 800, width: '100%' }}>
            <AgGridReact
                rowData={rowData} // Pass rowData directly as a prop
                // @ts-ignore
                columnDefs={columnDefs} // Pass column definitions as a prop
                defaultColDef={{
                    flex: 1,
                    minWidth: 100,
                    filter: true,
                    sortable: true,
                    resizable: true
                }}
                singleClickEdit={true}
                rowSelection="single"
                onGridReady={(params: any) => {
                    params.api.sizeColumnsToFit();
                }}
            />
        </div>
    );
}

export default EditableDataGrid;
