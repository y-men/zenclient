

"use client";

import { useGlobalStore } from "@/store/global-store";
import MatrixFormGrid from "@/components/matrix-form-grid";
import React, { useMemo } from "react";

export function WithEpics({ children }: { children: React.ReactElement }) {
    const epics = useGlobalStore(state => state.epics);

//    const memoizedEpics = useMemo(() => epics.map(epic => ({ id: epic.id, name: epic.name })), [epics]);
    return React.cloneElement(children, { y: epics });
}
