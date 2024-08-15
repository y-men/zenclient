
"use client";
import {useGlobalStore} from "@/store/global-store";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {router} from "next/client";
import {useRouter} from "next/navigation";


export default function DisplayDataGrid() {
    const router = useRouter();
    const activeSprints = useGlobalStore(state => state.sprints);
    console.log(activeSprints);
    const columnDefs = [
        { headerName: ' ', field: 'actions' },
        { headerName: 'Id', field: 'id' },
        { headerName: 'Name', field: 'name' },
    ];

    return (
        <div className="ag-theme-quartz" style={{ height: '100%', width: '100%' }}>
            <AgGridReact
                rowData={activeSprints}
                // @ts-ignore
                columnDefs={columnDefs}
                defaultColDef={{
                    flex: 1,
                    minWidth: 100,
                    filter: true,
                    sortable: true,
                    resizable: true
                }}

                singleClickEdit={true}
                rowSelection="single"
                onGridReady={(params: any) => {
                    params.api.sizeColumnsToFit();
                }}
                onRowClicked={(event: any) => {
                    console.log("row clicked", event.data);
                    router.push(`/sprint/${event.data.id}`);
                } }

            />
        </div>
  );
}