"use client";
import ReactDataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import Link from "next/link";
import { GridActionButton } from "@/components/grid-action-submit";

import React from "react";

const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString(); // or use any other formatting method you prefer
};

export default function DataGrid({ rows }: { rows: any[] | null }) {
  console.log("===> DataGrid <===");
  console.log(rows);
  return (
    <ReactDataGrid
      columns={[
        { key: "delete", name: "" },
        { key: "id", name: "ID" },
        { key: "name", name: "Title" },
        { key: "sprintId", name: "Sprint" },
        { key: "desc", name: "Description" },
        { key: "loe", name: "LOE" },
        { key: "startDate", name: "Start Date" },
        { key: "endDate", name: "End Date" },
      ]}
      rows={
        rows && Array.isArray(rows)
          ? rows.map(
              (row: any) =>
                ({
                  delete: <GridActionButton taskId={row.id} />,
                  id: row.id,
                  name: <Link href={`/grid/${row.id}`}>{row.name}</Link>,
                  sprintId: row.sprintId,
                  desc: row.desc,
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
