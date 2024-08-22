"use client"
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { ClientSideRowModelModule } from 'ag-grid-community';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState } from "react";
import { EditableGridActionButton } from "@/components/grid-action-submit";
import { Task } from "@/model/task";
import {createOrUpdateExistingTask, deleteTask, retrieveTasks} from "@/actions";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {useGlobalStore} from "@/store/global-store";

const EditableDataGrid = (
    { rows }: { rows: any[] | null },
) => {

    const activeSprints = useGlobalStore(state => state.sprints);
    const owners = useGlobalStore(state => state.owners);
    const [rowData, setRowData] = useState(rows);
    // activeSprints = activeSprints ? activeSprints : [];
    // owners = owners ? owners : [];
    console.log("----------------------------------------------");
    console.log("Rows", rows);
    console.log("Active sprints", activeSprints);
    console.log("Owners", owners);


    // --- Grid operations -----------------
    const handleAddRowAtAfterIndex = async (params: any) => {
        console.log("Adding row after index", params.rowIndex);
        const newRow =  {
            name: "",
            desc: "",
            // sprintId: 0,
            ownerId: params.data?.ownerId ?? 0,
            loe: 0,
            startDate: params.data?.endDate,
            endDate: new Date(),
            id: ''
        };
        //await createOrUpdateExistingTask(newRow);
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
                // Make sure the values are sorted so that N/A is always the first option
                values: owners!.map((owner  ) => owner.id).sort((a, b) =>  Number(a) - Number(b))
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
        <div className="ag-theme-quartz" style={{ height: '100%', width: '100%' }}>
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
                editType={"fullRow"}
                animateRows={false}
                onRowValueChanged={async (params: any) => {
                    const updatedTask: Task = params.data;
                    const createdTask = await createOrUpdateExistingTask(updatedTask);
                    const updatedRows = await retrieveTasks();
                    setRowData(updatedRows);
                }}


                // Grid initialization
                onGridReady={(params: any) => {
                    params.api.sizeColumnsToFit();
                    params.api.applyColumnState({
                        state: [
                            { colId: "ownerId", sort: "asc" },
                            { colId: "startDate", sort: "asc" },
                        ],
                        defaultState: { sort: null },

                    });
                }}
            />
        </div>
    );
}

export default EditableDataGrid;
