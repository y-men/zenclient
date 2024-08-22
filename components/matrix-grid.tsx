"use client";

import React, {useState, useMemo, useEffect} from 'react';
import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {Row} from "jackspeak";
import {useGlobalStore} from "@/store/global-store";


interface RowData {
    subject: string;

    [key: string]: number | string; // Allows dynamic keys for owners with numeric values
}

const MatrixGrid =
    ({
         owners, subjects, headerName = "Deductions", totalUnits = 10, onDataUpdate = () => {
        }
     }
         : {
        owners?: string[],
        subjects: string [],
        headerName?: string,
        totalUnits?: number,
        onDataUpdate?: Function
    }) => {

        // Fetch owners from global store if not provided
        // TODO This does not work as expected sometimes users are not loaded
        // const ownersFromDb = useGlobalStore(state => state.owners);
        // owners = owners || ownersFromDb.map(owner => owner.name);
        const ownersFromDb = useGlobalStore(state => state.owners);
        owners = owners || ownersFromDb.map(owner => owner.name);


        // Create initial row data
        // TODO Make sure this row repsent the sprint total days and marked 'Capacity' and 'Total' for the last row
        const createRowData = () => {
            const rowData: RowData [] = [];

            subjects.forEach((subject, index) => {
                const row: RowData = {subject};
                owners.forEach((owner) => {
                    row[owner] = index === 0 ? totalUnits : 0;
                });
                rowData.push(row);
            });

            // Add a summary row
            const summaryRow: RowData = {subject: 'Summary'};

            owners.forEach((owner) => {
                summaryRow[owner] = totalUnits;
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
                    headerName: owner,
                    field: owner,
                    // @ts-ignore

                    editable: (params) => params.node.rowIndex !== 0 && params.node.data.deduction !== 'Summary',
                    valueParser: (params: { newValue: string; }) => parseFloat(params.newValue) || 0,
                });
            });

            return cols;
        }, []);

        const onCellValueChanged = (params: { data: { subject: string; }; }) => {
            if (params.data.subject === 'Summary') return;

            const updatedData = rowData.map((row) => ({...row}));
            owners.forEach((owner) => {
                let sum = updatedData[0][owner];
                for (let i = 1; i < subjects.length; i++) {
                    // @ts-ignore
                    sum -= updatedData[i][owner];
                }
                updatedData[subjects.length][owner] = sum; // Update the summary row
            });
            setRowData(updatedData);
            onDataUpdate(updatedData);
        };

        useEffect(() => {
            onDataUpdate(rowData);
        }, [rowData]);

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
