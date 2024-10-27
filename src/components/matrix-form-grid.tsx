"use client";

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {useGlobalStore} from "@/store/global-store";


// TODO check if wee need the subject here
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
 * @param matrixFormAction - The action to be performed when the form is submitted , Should be a server side function
 * @param addtionalActions
 * @constructor
 */
const MatrixFormGrid = ({x, y, headerName = "Deductions", totalUnits = 10,
                            matrixFormAction = () => {},
                            addtionalActions = [],
                           initialData=null
}
                        : {
    x?: {id:string,name:string }  [],
//y: string [],
    y: {id:string,name:string }  [],

    headerName?: string,
    totalUnits?: number,
    matrixFormAction?: Function
    addtionalActions?: { name: string, action:Function } []
    initialData?: number[][]| null
}) => {

    //Use global store to retrieve the epics if the y-axis is not provided
    x = useGlobalStore(state => state.owners);

    //
    // console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
    // console.dir(initialData)

    // Always add 'Total' to the y-axis
    y = [{id:`totals`, name:`Total`}, ...y];
    const createRowData = () => {
        const rowData: RowData [] = [];
        y.forEach((entry, index) => {
            const row: RowData = {subject: entry.id};
            // x.forEach((owner) => {
            //     row[owner.id] = index === 0 ? totalUnits : 0;

            x.forEach((owner, colIndex) => {
                    if (index === 0) {
                            row[owner.id] = totalUnits;
                        } else if (initialData && index <= initialData.length && colIndex < initialData[index - 1].length) {
                            row[owner.id] = initialData[index - 1][colIndex];
                        } else {
                           row[owner.id] = 0;
                       }
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
//                sum += row[owner.id];
                sum += Number(row[owner.id]);
            });
            row.acc = sum;
        });


        return rowData;
    };

    const [rowData, setRowData] = useState(createRowData);

    //Add the initial data to the row data
    useEffect(() => {
            setRowData(createRowData());
        }, [initialData]);

    const columns = useMemo(() => {
        const cols = [
            {
                headerName: headerName,
                field: 'subject',
                editable: false,
                valueFormatter: (params: any) => {
                    const selectedSprint = y.find((epic) => epic.id === params.value);
                    return selectedSprint?.name
                }

            },
            {
                headerName: 'Accumulated',
                field: 'acc',
                editable: false,
                valueFormatter: (params: any) => {
                    if (typeof params.value === 'number') {
                        return params.value.toFixed(2) as string;
                    }
                    return params.value;
                }

            }
        ];

        x.forEach((owner) => {
            cols.push({
                headerName: owner.name,
                field: owner.id,
                // @ts-ignore

                editable: (params) => params.node.rowIndex !== 0 && params.node.data.deduction !== 'Summary',
                valueFormatter: (params: any) => {
                    if (typeof params.value === 'number') {
                        return params.value.toFixed(2) as string;
                    }
                    return params.value;
                },
                cellStyle: (params: any) => {
                    const rowIndex = params.node.rowIndex;
                    const lastRowIndex = params.api.getDisplayedRowCount() - 1;

                    // Exclude the `Total` row and the 'Summary' row
                    if (rowIndex !== 0
                        && rowIndex !== lastRowIndex
                        && typeof params.value === 'number') {
                        return params.value > 0 ? {backgroundColor: 'lightYellow'} : {};
                    }
                    return {}; // Return empty object for the first and last rows or non-numeric values
                }


                // valueParser: (params: { newValue: string; }) => parseFloat(params.newValue) || 0,

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
//                sum -= updatedData[i][owner.id];
                // @ts-ignore
                sum -= Number(updatedData[i][owner.id]);

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

    // @ts-ignore
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
            <div className="d-flex flex-row">
                <button className="btn btn-primary mb-2" type="submit">
                    Save
                </button>
                {addtionalActions.map((action) => (
                    // @ts-ignore
                    <button key={action.name} className="btn btn-primary mb-2 ms-2"
                            onClick={() =>  action.action()}>
                        {action.name}
                    </button>
                ))}
            </div>
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
                        resizable: true,
                        // valueFormatter: (params: any) => {
                        //     if (typeof params.value === 'number') {
                        //         return params.value.toFixed(2) as string;
                        //     }
                        //     return params.value;
                        // }

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
