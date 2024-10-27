"use client";
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {ColDef, ColGroupDef} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {useGlobalStore} from "@/store/global-store";
import {IQuarterCommitment} from "@/db";


// TODO Not sure there is a need for this interface
interface Developer {
    name: string;
}

// TODO Not sure there is a need for this interface
interface Project {
    id: string;
    name: string;
}

// TODO Not sure there is a need for this interface
interface QuarterlyPlanningGridProps {
   // month: 'Jan' | 'Apr' | 'Jul' | 'Oct';
    quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    year?: number;
    action?: (formData: FormData) => void;
    quarterSelectionDisabled?: boolean;
    commitments?: IQuarterCommitment[];
}

const QuarterlyPlanningGrid: React.FC<QuarterlyPlanningGridProps> = ({
                                                                         quarterSelectionDisabled = false,
                                                                         quarter = 'Q1',
                                                                         year = new Date().getFullYear(),
                                                                         action,
                                                                        commitments


                                                                     }) => {

    const developers = useGlobalStore(state => state.owners);
    const projects = useGlobalStore(state => state.epics);
    const gridRef = useRef<AgGridReact>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);
   // const rowData = developers;
    const [rowData, setRowData] = useState(developers);

    //Add exsitting data to the grid
    useEffect(() => {
        if (commitments && commitments.length > 0) {
            const updatedRowData = developers.map(developer => {
                const developerCommitments = commitments.filter(
                    (commitment: IQuarterCommitment) => commitment.ownerId === developer.id
                );
                const updatedDeveloper = { ...developer };
                developerCommitments.forEach((commitment: IQuarterCommitment) => {
                    // @ts-ignore
                    updatedDeveloper[commitment.week] = commitment.epicId;
                });
                return updatedDeveloper;
            });
            setRowData(updatedRowData);
        } else {
            // Clear existing data if no commitments are provided
            const emptyRowData = developers.map(developer => {
                const emptyDeveloper = { ...developer };
                // Clear all week fields
                for (let i = 1; i <= 12; i++) {
                    // @ts-ignore
                    emptyDeveloper[`w${i}`] = null;
                }
                return emptyDeveloper;
            });
            setRowData(emptyRowData);
        }
    }, [developers, commitments]);



    const [selectedQuarter, setSelectedQuarter] = useState(quarter);
    const [selectedYear, setSelectedYear] = useState('2024');

    const years = useMemo(() => {
        return Array.from({length: 7}, (_, i) => (2024 + i).toString());
    }, []);

    const month = useMemo(() => {
        switch (selectedQuarter) {
            case 'Q1':
                return 'Jan';
            case 'Q2':
                return 'Apr';
            case 'Q3':
                return 'Jul';
            case 'Q4':
                return 'Oct';
            default:
                return 'Jan';
        }
    }, [selectedQuarter]);

    const quarterName = useMemo(() => {
        return `${selectedQuarter}${selectedYear}`;
    }, [selectedQuarter, selectedYear]);

    const projectColors = useMemo(() => {
        // TODO: configuration: colors should be configurable
        const colors = ['#E0F0E3', '#F0E6E3', '#E3E0F0', '#F0EDE3',
            '#E3F0ED', '#F0E3EC', '#EDF0E3', '#E3E8F0'];

        return projects.reduce((acc, project, index) => {
            acc[project.id] = colors[index % colors.length];
            return acc;
        }, {} as Record<string, string>);
    }, [projects]);


    const getQuarterDates = (month: string, year: number) => {
        const monthIndex = ['Jan', 'Apr', 'Jul', 'Oct'].indexOf(month);
        const startDate = new Date(year, monthIndex * 3, 1);
        const endDate = new Date(year, (monthIndex + 1) * 3, 0);
        return {startDate, endDate};
    };

    const columnDefs = useMemo<(ColDef | ColGroupDef)[]>(() => {
        const {startDate, endDate} = getQuarterDates(month, year);
        const columns: (ColDef | ColGroupDef)[] = [{
            headerName: 'Developer', field: 'name', pinned: 'left', width: 150
        }];

        let currentDate = new Date(startDate);
        let sprintCount = 1;
        let weekCount = 1;
        let monthCount = 0;

        const monthGroups: ColGroupDef[] = [];

        while (monthCount < 3) {
            const currentMonth = currentDate.toLocaleString('default', {month: 'short'});
            let monthGroup: ColGroupDef = {
                headerName: currentMonth,
                children: [],
            };
            monthGroups.push(monthGroup);

            //todo Fix sprint count to continue the couting from previous month
            for (let i = 0; i < 2; i++) {  // 2 sprints per month
                const sprintGroup: ColGroupDef = {
                    headerName: `S${sprintCount}`,
                    children: [],
                };
                monthGroup.children.push(sprintGroup);

                for (let j = 0; j < 2; j++) {  // 2 weeks per sprint
                    // @ts-ignore
                    const weekColumn: ColDef = {
                        headerName: `W${weekCount}`,
                        field: `w${weekCount}`,
                        width: 50,
                        editable: true,
                        cellEditor: 'agSelectCellEditor',
                        cellEditorParams: {
                            values: projects.map(p => p.id),
                        },
                        //@ts-ignore
                        valueFormatter: (params: any) => {
                            const epic = projects.find((p) => p.id === params.value);
                            return epic?.name
                        },
                        cellStyle: (params: any) => {
                            if (params.value) return {backgroundColor: projectColors[params.value], color: '#333333'};
                            return null;
                        },
                    };
                    sprintGroup.children!.push(weekColumn);
                    weekCount++;
                }
                sprintCount++;
            }

            currentDate.setMonth(currentDate.getMonth() + 1);
            monthCount++;
            sprintCount = 1;  // Reset sprint count for each month
        }

        columns.push(...monthGroups);
        return columns;
    }, [month, year]);
    // ------

    const defaultColDef = useMemo<ColDef>(() => ({
        sortable: true, filter: true, resizable: true,
    }), []);

    //TODO Utils ? Component ? <WithHiddenInput/> ?
    const updateHiddenInput = () => {
        if (gridRef.current && hiddenInputRef.current) {
            const currentRowData: any[] = [];
            gridRef.current.api.forEachNode((node: { data: any; }) => currentRowData.push(node.data));
            hiddenInputRef.current.value = JSON.stringify(currentRowData);
        }
    };

    const onCellValueChanged = (params: { data: { subject: string; }; }) => {
        console.log('onCellValueChanged', params);
        updateHiddenInput()
    }

    return (<form action={action} method="post"
                  style={{height: '100%', width: '100%'}}
                  className="container-fluid d-flex flex-column"
                  onSubmit={(e) => {
                      updateHiddenInput();
                  }}
        >
            <input
                type="hidden"
                name="sprintData"
                ref={hiddenInputRef}
            />

        {action && <button className="btn btn-primary " type="submit"> Save </button>}
            <hr className="my-3"/>

        <div className="d-flex flex-row mb-2">
            <label className="text-left me-2">Quarter Name:</label>
            <select
                disabled={quarterSelectionDisabled}
                className="form-select me-2"
                style={{width: 'auto'}}
                // name="quarter"
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value as 'Q1' | 'Q2' | 'Q3' | 'Q4')}
            >
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
            </select>
            <select
                disabled={quarterSelectionDisabled}
                className="form-select me-2"
                style={{width: 'auto'}}
                // name="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
            >
                {years.map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
            <input
                type="hidden"
                name="quarter"
                value={selectedQuarter}
            />
            <input
                type="hidden"
                name="year"
                value={selectedYear}
            />
            <input
                type="hidden"
                name="firstMonth"
                value={month}
            />
            {/*{!quarterSelectionDisabled && <input*/}
            {/*    type="text"*/}
            {/*    name="quarterName"*/}
            {/*    className="form-control"*/}
            {/*    style={{width: 'auto'}}*/}
            {/*    value={quarterName}*/}
            {/*    readOnly*/}
            {/*/>}*/}
            <input
                type={!quarterSelectionDisabled ? "text" : "hidden"}
                name="quarterName"
                className="form-control"
                style={{width: 'auto'}}
                value={quarterName}
                readOnly
            />

        </div>
        <div className="ag-theme-quartz" style={{height: '100%', width: '100%'}}>
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    suppressRowHoverHighlight={true}
                    suppressRowDeselection={true}
                    onCellValueChanged={onCellValueChanged}
                    singleClickEdit={true}
                    headerHeight={150}
                    groupHeaderHeight={50}
                    onGridReady={(params: any) => {
                        params.api.sizeColumnsToFit();
                        // Empty or upload the grid displayed data
                    }}
                    onGridColumnsChanged={
                        (params: any) => {
                            params.api.sizeColumnsToFit();
                        }
                    }
                />
            </div>
        </form>);
};

export default QuarterlyPlanningGrid;