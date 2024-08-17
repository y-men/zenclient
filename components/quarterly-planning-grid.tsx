"use client";
import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

interface Developer {
    name: string;
}

interface Project {
    id: string;
    name: string;
}

interface QuarterlyPlanningGridProps {
    month: 'Jan' | 'Apr' | 'Jul' | 'Oct';
    year?: number;
}

const QuarterlyPlanningGrid: React.FC<QuarterlyPlanningGridProps> =
    ({ month, year = new Date().getFullYear() }) => {
        const developers: Developer[] = [
            { name: 'Alice Johnson' },
            { name: 'Bob Smith' },
            { name: 'Charlie Brown' },
        ];

        const projects: Project[] = [
            { id: 'P1', name: 'Alpha' },
            { id: 'P2', name: 'Beta' },
            { id: 'P3', name: 'Gamma' },
        ];

        const [rowData, setRowData] = useState(developers.map(dev => ({ name: dev.name })));

        const getQuarterDates = (month: string, year: number) => {
            const monthIndex = ['Jan', 'Apr', 'Jul', 'Oct'].indexOf(month);
            const startDate = new Date(year, monthIndex * 3, 1);
            const endDate = new Date(year, (monthIndex + 1) * 3, 0);
            return { startDate, endDate };
        };

        const columnDefs = useMemo<(ColDef | ColGroupDef)[]>(() => {
            const { startDate, endDate } = getQuarterDates(month, year);
            const columns: (ColDef | ColGroupDef)[] = [
                { headerName: 'Developer', field: 'name', pinned: 'left', width: 150 },
            ];

            let currentDate = new Date(startDate);
            let sprintCount = 1;
            let weekCount = 1;

            const monthGroups: ColGroupDef[] = [];

            while (currentDate <= endDate) {
                const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
                let monthGroup = monthGroups.find(group => group.headerName === currentMonth);
                if (!monthGroup) {
                    monthGroup = {
                        headerName: currentMonth,
                        children: [],
                    };
                    monthGroups.push(monthGroup);
                }

                if (weekCount % 2 === 1 || monthGroup.children.length === 0) {
                    const sprintGroup: ColGroupDef = {
                        headerName: `Sprint ${sprintCount}`,
                        children: [],
                    };
                    monthGroup.children.push(sprintGroup);
                    sprintCount++;
                }

                const weekColumn: ColDef = {
                    headerName: `W${weekCount}`,
                    field: `week${weekCount}`,
                    width: 50,
                    editable: true,
                    cellEditor: 'agSelectCellEditor',
                    cellEditorParams: {
                        values: projects.map(p => p.name),
                    },
                };

                (monthGroup.children[monthGroup.children.length - 1] as ColGroupDef).children!.push(weekColumn);

                currentDate.setDate(currentDate.getDate() + 7);
                weekCount++;
            }

            columns.push(...monthGroups);
            return columns;
        }, [month, year]);

        const defaultColDef = useMemo<ColDef>(() => ({
            sortable: true,
            filter: true,
            resizable: true,
        }), []);

        return (
            <div className="ag-theme-quartz" style={{ height: '100%', width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    suppressRowHoverHighlight={true}
                    suppressRowDeselection={true}
                    headerHeight={150}
                    groupHeaderHeight={50}
                    onGridReady={(params: any) => {
                        params.api.sizeColumnsToFit();
                    }}
                />
            </div>
        );
    };

export default QuarterlyPlanningGrid;