"use client";

import React, {useMemo, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {useGlobalStore} from "@/store/global-store";


interface RowData {
    subject: string;

    [key: string]: number | string; // Allows dynamic keys for owners with numeric values
}

/**
 * A generic matrix utility that allows for the creation of a matrix form grid
 * @param x
 * @param y
 * @param headerName
 * @param totalUnits
 * @param matrixFormAction
 * @constructor
 */
const MatrixFormGrid = ({x, y, headerName = "Deductions", totalUnits = 10, matrixFormAction = () => {}}
                        : {
    x?: {id:string,name:string }  [],
    y: string [],
    headerName?: string,
    totalUnits?: number,
    matrixFormAction?: Function
}) => {

    x = useGlobalStore(state => state.owners);
    const createRowData = () => {
        const rowData: RowData [] = [];
        y.forEach((subject, index) => {
            const row: RowData = {subject};
            x.forEach((owner) => {
                row[owner.id] = index === 0 ? totalUnits : 0;
                // @ts-ignore
            });
            rowData.push(row);
        });

        // Add a summary row
        const summaryRow: RowData = {subject: 'Summary'};
        x.forEach((owner) => {
            summaryRow[owner.id] = totalUnits;
        });
        rowData.push(summaryRow);

        //Add accamulted column
        rowData.forEach((row) => {
            let sum = 0;
            x.forEach((owner) => {
                // @ts-ignore
                sum += row[owner.id];
            });
            row.acc = sum;
        });


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
            {
                headerName: 'Accumulated',
                field: 'acc',
                editable: false,
            }
        ];

        x.forEach((owner) => {
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

        // Calculate summary row (Y's)
        x.forEach((owner) => {
            let sum = updatedData[0][owner.id];
            for (let i = 1; i < y.length; i++) {
                // @ts-ignore
                sum -= updatedData[i][owner.id];
            }
            updatedData[y.length][owner.id] = sum; // Update the summary row
        });

        // Calculate acc column (X's)
        updatedData.forEach((row) => {
            let sum = 0;
            x.forEach((owner) => {
                // @ts-ignore
                sum += row[owner.id];
            });
            row.acc = sum;
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
