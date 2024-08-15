"use client";

import React, {useState, useMemo} from 'react';
import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {Row} from "jackspeak";


interface RowData {
    deduction: string;

    [key: string]: number | string; // Allows dynamic keys for owners with numeric values
}

const MatrixGrid = () => {
    const owners = ['Thor', 'Fandral', 'Hogun', 'Volstagg', 'Sif'];
    const deductions = ['vacations', 'KTLO', 'misc'];

    // Create initial row data
    const createRowData = () => {
        const rowData: RowData [] = [];
        deductions.forEach((deduction, index) => {
            const row: RowData = {deduction};
            owners.forEach((owner) => {
                row[owner] = index === 0 ? 10 : 0; // First row with constant 10, others 0
            });
            rowData.push(row);
        });

        // Add a summary row
        const summaryRow: RowData = {deduction: 'Summary'};
        owners.forEach((owner) => {
            summaryRow[owner] = 10; // Initially just reflecting the first row (10)
        });
        rowData.push(summaryRow);

        return rowData;
    };

    const [rowData, setRowData] = useState(createRowData);

    const columns = useMemo(() => {
        const cols = [
            {
                headerName: 'Deduction',
                field: 'deduction',
                editable: false,
            },
        ];

        owners.forEach((owner) => {
            cols.push({
                headerName: owner,
                field: owner,
                // @ts-ignore

                editable: (params) => params.node.rowIndex !== 0 && params.node.data.deduction !== 'Summary',
                valueParser: (params: { newValue: string; }) => parseFloat(params.newValue) || 0,
            });
        });

        return cols;
    }, []);

    const onCellValueChanged = (params: { data: { deduction: string; }; }) => {
        if (params.data.deduction === 'Summary') return;

        const updatedData = rowData.map((row) => ({...row}));
        owners.forEach((owner) => {
            let sum = updatedData[0][owner]; // Start with the first row (constant 10)
            for (let i = 1; i < deductions.length; i++) {
                // @ts-ignore
                sum -= updatedData[i][owner];
            }
            updatedData[deductions.length][owner] = sum; // Update the summary row
        });
        setRowData(updatedData);
    };

    return (
        <div className="ag-theme-quartz" style={{height: '100%', width: '100%'}}>
            <AgGridReact
                rowData={rowData}
                // @ts-ignore
                columnDefs={columns}
                defaultColDef={{
                    flex: 1,
                    minWidth: 100,
                    resizable: true
                }}
                animateRows={true}
                onCellValueChanged={onCellValueChanged}
                rowSelection="single"
                onGridReady={(params: any) => {
                    params.api.sizeColumnsToFit();
                }}
            />
        </div>
    );
};

export default MatrixGrid;
