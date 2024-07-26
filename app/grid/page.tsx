//"use client";
//import React, { useEffect, useState } from "react";
import Link from "next/link";
import {retrieveTasks, retrieveActiveSprints, deleteTask} from "@/actions";
import DataGrid from "@/components/data-grid";
//import { useRouter } from "next/router";
import DropDownSelector from "@/components/drop-down-selector";

export default async function Grid() {
    // Get the data from the server
    const rows = await retrieveTasks();
    const activeSprintsFromDb = await retrieveActiveSprints();
    const activeSprints = activeSprintsFromDb.map((sprint: any) => ({
        value: sprint.id,
        label: sprint.name,
    }));

// Use Context to save the data for the rowa and activeSprints

    return (
        <div>
            <h1>Grid Page </h1>
            <Link href="/grid/add/">
                <button className="btn btn-primary">
                    Add Task
                </button>
            </Link>

            <div style={{paddingTop: 4}}>
                <DataGrid rows={rows}/>
            </div>

            <div style={{paddingTop: 20}}>
                <DropDownSelector options={activeSprints}/>
            </div>
        </div>
    );
} // Path: src/app/plan/page.tsx
