"use client";

import React, {useState, useMemo, useEffect, useRef} from 'react';
import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {Row} from "jackspeak";
import {useGlobalStore} from "@/store/global-store";


interface RowData {
    subject: string;

    [key: string]: number | string; // Allows dynamic keys for owners with numeric values
}

/**
 * Calculate data in the matrix including
 * @param owners
 * @param subjects
 * @param headerName
 * @param totalUnits
 * @param onDataUpdate
 * @constructor
 */
const MatrixFormGrid = ({owners, subjects, headerName = "Deductions", totalUnits = 10, matrixFormAction = () => {}}
                        : {
    owners?: {id:string,name:string }  [],
    subjects: string [],
    headerName?: string,
    totalUnits?: number,
    matrixFormAction?: Function
}) => {

    const ownersFromDb = useGlobalStore(state => state.owners);
    owners = ownersFromDb;
        //owners || ownersFromDb.map(owner => owner.name);
    const createRowData = () => {
        const rowData: RowData [] = [];
        subjects.forEach((subject, index) => {
            const row: RowData = {subject};
            owners.forEach((owner) => {
                row[owner.id] = index === 0 ? totalUnits : 0;
            });
            rowData.push(row);
        });

        // Add a summary row
        const summaryRow: RowData = {subject: 'Summary'};

        owners.forEach((owner) => {
            summaryRow[owner.id] = totalUnits;
        });
        rowData.push(summaryRow);
        return rowData;
    };

    const [rowData, setRowData] = useState(createRowData);
    const columns = useMemo(() => {
        const cols = [
            {
                headerName: headerName,
                field: 'subject',
                editable: false,
            },
        ];

        owners.forEach((owner) => {
            cols.push({
                headerName: owner.name,
                field: owner.id,
                // @ts-ignore

                editable: (params) => params.node.rowIndex !== 0 && params.node.data.deduction !== 'Summary',
                valueParser: (params: { newValue: string; }) => parseFloat(params.newValue) || 0,
            });
        });

        return cols;
    }, []);


    const gridRef = useRef<AgGridReact>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    // const updateHiddenInput = (params : any) => {
    //     if (gridRef.current && hiddenInputRef.current) {
    //         const currentRowData: any[] = [];
    //         gridRef.current.api.forEachNode((node: { data: any; }) => currentRowData.push(node.data));
    //         debugger
    //         hiddenInputRef.current.value = JSON.stringify(currentRowData);
    //     }
    //
    // };

    const updateHiddenInput = () => {
        if (gridRef.current && hiddenInputRef.current) {
            const currentRowData: any[] = [];
            gridRef.current.api.forEachNode((node: { data: any; }) => currentRowData.push(node.data));
            hiddenInputRef.current.value = JSON.stringify(currentRowData);
        }
    };



    const onCellValueChanged = (params: { data: { subject: string; }; }) => {
        if (params.data.subject === 'Summary') return;

        const updatedData = rowData.map((row) => ({...row}));
        owners.forEach((owner) => {
            let sum = updatedData[0][owner.id];
            for (let i = 1; i < subjects.length; i++) {
                // @ts-ignore
                sum -= updatedData[i][owner.id];
            }
            updatedData[subjects.length][owner.id] = sum; // Update the summary row
        });
        setRowData(updatedData);
        updateHiddenInput();
    };



    return (
        // @ts-ignore
        <form action={matrixFormAction}
              style={{height: '100%', width: '100%'}}
              className="container-fluid d-flex flex-column"

            // Ensure the latest data is captured before submission
              onSubmit={(e) => {
                  updateHiddenInput();
              }}

        >
            <button className="btn btn-primary mb-2" type="submit">
                Save
            </button>
            <input
                type="hidden"
                name="sprintData"
                ref={hiddenInputRef}
            />
            <div className="ag-theme-quartz" style={{height: '100%', width: '100%'}} >
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    // @ts-ignore
                    columnDefs={columns}
                    defaultColDef={{
                        flex: 1,
                        minWidth: 100,
                        resizable: true
                    }}
                    animateRows={false}
                    onCellValueChanged={onCellValueChanged}
                    rowSelection="single"
                    onGridReady={(params: any) => {
                        params.api.sizeColumnsToFit();
                        updateHiddenInput();

                    }}
                />

            </div>
        </form>
);
};

export default MatrixFormGrid;
