"use client"
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { ClientSideRowModelModule } from 'ag-grid-community';

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";// Optional Theme applied to the Data Grid
import { useState } from "react";
import { EditableGridActionButton } from "@/components/grid-action-submit";
import { Task } from "@/model/task";
import {createOrUpdateExistingTask, deleteTask, retrieveTasks} from "@/actions";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

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


    // --- Grid operations -----------------
    function handleAddRowAtAfterIndex(params: any) {
        console.log("Adding row after index", params.rowIndex);
        const newRow: Task = {
            name: "",
            desc: "",
            // sprintId: 0,
            // ownerId: 0,
            loe: 0,
            startDate: params.data?.endDate,
            endDate: new Date(),
            id: ''
        };
        const updatedRows = [...rowData!];
        updatedRows.splice(params.node.rowIndex + 1, 0, newRow); // Insert the new row after the selected row
        setRowData(updatedRows);
    }

    const handleDeleteRow = async (params: any) => {
        console.log("Deleting row", params);
        await  deleteTask(params.data.id);
        const updatedRows = [...rowData!];
        updatedRows.splice(params.node.rowIndex, 1); // Remove the row
        setRowData(updatedRows);
        //TODO Another option is to re-fetch the data from the server
    }

    // --- Grid configuration -----------------
    const columnDefs = [
        {
            field: "actions",
            headerName: " ",
            width: 150,
            minWidth: 150,
            resizable: false,
            cellRenderer: (params: any) => (
                <EditableGridActionButton
                    onClick={{
                        add: () => handleAddRowAtAfterIndex(params),
                        carryonver: (params: any) => console.log("Carryover"),
                        delete: () => handleDeleteRow(params)
                    }}
                    {...params}
                />
            )
        },
        { field: "id", name: "ID" },
        {
            field: "name",
            name: "Title",
            editable: true,
            cellEditor: "agTextCellEditor",
        },
        {
            field: "sprintId",
            name: "Sprint",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: activeSprints.map(sprint => sprint.id)
            },
            valueFormatter: (params: any) => {
                const selectedSprint = activeSprints.find((sprint) => Number(sprint.id) === Number(params.value));
                return selectedSprint?.name
            }
        },
        {
            field: "desc",
            name: "Description",
            editable: true,
            cellEditor: "agTextCellEditor",

        },
        {
            field: "ownerId",
            name: "Owner",
            editable: true,
            // cellRenderer: "agSelectCellRenderer",
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: owners!.map((owner: { id: number; name: string }) => owner.id)
            },
            valueFormatter: (params: any) => owners!.find((owner) => Number(owner.id) === Number(params.value))?.name
        },
        {
            field: "loe",
            name: "LOE",
            editable: true,
            cellEditor: "agNumberCellEditor",
        },
        { field: "startDate", name: "Start Date" },
        {   field: "endDate",
            name: "End Date"
        },
    ];

    return (
        <div className="ag-theme-quartz" style={{ height: 600, width: '100%' }}>
            <AgGridReact
                rowData={rowData}
                // @ts-ignore
                columnDefs={columnDefs}
                defaultColDef={{
                    flex: 1,
                    minWidth: 100,
                    filter: true,
                    sortable: true,
                    resizable: true
                }}
                singleClickEdit={true}
                rowSelection="single"
                onCellEditingStopped={async (params: any) => {
                    const updatedTask: Task = params.data;
                    const createdTask = await createOrUpdateExistingTask(updatedTask);  // Await the operation
                    const updatedRows = await retrieveTasks();
                    setRowData(updatedRows);

                }}
                onCellKeyDown={async (params: any) => {
                    console.log("Cell key down", params);
                    if (params.event.key === 'Enter') {
                       // params.api.stopEditing();
                       //  const updatedTask: Task = params.data;
                       //  const createdTask = await createTaskInLine(updatedTask);  // Await the operation
                       //  const updatedRows = await retrieveTasks();
                       //  setRowData(updatedRows);
                    }
                }}

                onGridReady={(params: any) => {
                    params.api.sizeColumnsToFit();
                }}
            />
        </div>
    );
}

export default EditableDataGrid;
