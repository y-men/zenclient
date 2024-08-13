
"use client";
import {useGlobalStore} from "@/store/global-store";
import {retrieveActiveSprints, retrieveOwners} from "@/actions";
import {useEffect} from "react";

// export const HydrateGlobalStore = (
//     {sprints, owners}: { sprints?: { id: string; name: string }[], owners?: { id: string; name: string }[] },
// ) => {

// @ts-ignore
export const HydrateGlobalStore = ({children}) => {
    const owners = useGlobalStore(state => state.owners);
    const sprints = useGlobalStore(state => state.sprints);
    const setSprints = useGlobalStore(state => state.setSprints);
    const setOwners = useGlobalStore(state => state.setOwners);
    const isSprintsValid = useGlobalStore(state => state.isSprintsValid);
    const isOwnersValid = useGlobalStore(state => state.isOwnersValid);
    const setSprintsValid = useGlobalStore(state => state.setSprintsValid);
    const setOwnersValid = useGlobalStore(state => state.setOwnersValid);

    useEffect(() => {
        if (!isSprintsValid) {
            (async () => {
                const activeSprintsFromDb: { id: string, name: string }[] | null = await retrieveActiveSprints();
                setSprints(activeSprintsFromDb);
                setSprintsValid(true);
            })()
        }
        if (!isOwnersValid) {
            (async () => {
                const ownersFromDb: { id: string, name: string }[] | null = await retrieveOwners();
                setOwners(ownersFromDb);
                setOwnersValid(true)
            })()
        }

    })
    return <>{children}</>;
}
