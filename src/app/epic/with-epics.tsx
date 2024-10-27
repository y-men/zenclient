

"use client";

import { useGlobalStore } from "@/store/global-store";
import MatrixFormGrid from "@/components/matrix-form-grid";
import React, { useMemo } from "react";

export function WithEpics({ children }: { children: React.ReactElement }) {
    const epics = useGlobalStore(state => state.epics);

//    const memoizedEpics = useMemo(() => epics.map(epic => ({ id: epic.id, name: epic.name })), [epics]);
    return React.cloneElement(children, { y: epics });
}


// "use client";
// import {useGlobalStore} from "@/store/global-store";
// import MatrixFormGrid from "@/components/matrix-form-grid";
// import React from "react";
//
//
// export function WithEpics({ children }: { children: React.ReactElement } ) {
//     const epics = useGlobalStore(state => state.epics).map(epic => ({ id: epic.id, name: epic.name }));
//     const matrix = React.Children.only(children);
//     matrix.props.y = epics;
//     return <>{matrix}</>
// }