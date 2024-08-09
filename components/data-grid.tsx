"use client";
import ReactDataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import Link from "next/link";

import {GridActionButton} from "@/components/grid-action-submit";
import DropDownSelector from "@/components/drop-down-selector";

import React from "react";
import {assignSprintToTask, retrieveActiveSprints} from "@/actions";
import Select from "react-select";

import  { useState } from "react";


const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString(); // or use any other formatting method you prefer
};

// const activeSprintsFromDb = await retrieveActiveSprints();
// const activeSprints = activeSprintsFromDb.map((sprint: { id:number,name:string }) => ({
//     value: sprint.id,
//     label: sprint.name,
// }));

const activeSprints = [
    { id: '1', name: 'S1Q1*' },
    { id: '2', name: 'S2Q1*' },
    { id: '3', name: 'S3Q1*' },
];


const DropDownEditor = ( row:any ) => {
    return (
        <Select
            options={activeSprints.map((sprint: { id: string; name: string }) => ({ value: sprint.id, label: sprint.name }))}
            onChange={ (option) => {
                assignSprintToTask(row.id, Number(option?.value));
            }}
          //  value={activeSprints.find(option => option.value === row.sprintId)}
            placeholder="Select an option"
        />

    );
}

const hadleRowsChange = (rows: any, data: any) => {
    console.log("===> hadleRowsChange <===");
    console.log(`rows: ${rows}`);
}

export default function DataGrid({rows}: { rows: any[] | null }) {

    function findSprintNameById(row: any):string {
        const s = activeSprints.find((sprint) => Number(sprint.id) === row.sprintId)
        return s ? s.name : "N/A";
    }

    return (
        <ReactDataGrid
            onRowsChange={hadleRowsChange}
            columns={[
                {key: "delete", name: " "},
                {key: "id", name: "ID"},
                {key: "name", name: "Title"},
                {
                    key: "sprintId",
                    name: "Sprint",
                    // editor: DropDownEditor,
                    // formatter: ({value}: { value: any }) => {
                    //     const sprint = activeSprints.find((sprint: any) => sprint.value === value);
                    //     return sprint ? sprint.label : "";
                    // }

                },
                {key: "desc", name: "Description"},
                {key: "loe", name: "LOE"},
                {key: "startDate", name: "Start Date"},
                {key: "endDate", name: "End Date"},
            ]}
            rows={
                rows && Array.isArray(rows)
                    ? rows.map(
                        (row: any) =>
                            ({
                                delete: <GridActionButton taskId={row.id}/>,
                                id: row.id,
                                name: <Link href={`/grid/${row.id}`}>{row.name}</Link>,
                                desc: row.desc,
                                sprintId: <input value={findSprintNameById(row)}
                                                 onChange={(event)=>{ assignSprintToTask(row.id, Number(event.target.value));

                                }}  />,

                                // sprintId:<DropDownEditor row={row} />,
                                loe: row.loe,
                                startDate: formatDate(row.startDate), // or use any other formatting method you prefer
                                endDate: formatDate(row.endDate)
                            }) as any,
                    )
                    : []
            }
        />
    );
}
