
"use client";
import {useGlobalStore} from "@/store/global-store";
import {retrieveActiveSprints, retrieveOwners , retrieveEpics } from "@/actions";
import {useEffect} from "react";

// export const HydrateGlobalStore = (
//     {sprints, owners}: { sprints?: { id: string; name: string }[], owners?: { id: string; name: string }[] },
// ) => {

// @ts-ignore
export const HydrateGlobalStore = ({children}) => {
    const owners = useGlobalStore(state => state.owners);
    const sprints = useGlobalStore(state => state.sprints);
    const epics = useGlobalStore(state => state.epics);

    const setSprints = useGlobalStore(state => state.setSprints);
    const setOwners = useGlobalStore(state => state.setOwners);
    const setEpics = useGlobalStore(state => state.setEpics);

    const isSprintsValid = useGlobalStore(state => state.isSprintsValid);
    const isOwnersValid = useGlobalStore(state => state.isOwnersValid);
    const isEpicsValid = useGlobalStore(state => state.isEpicsValid);

    const setSprintsValid = useGlobalStore(state => state.setSprintsValid);
    const setOwnersValid = useGlobalStore(state => state.setOwnersValid);
    const setEpicsValid = useGlobalStore(state => state.setEpicsValid);

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
        if( !isEpicsValid) {
            (async () => {
                //TODO: refactor : This is a great example why i should create a model for epics and all the other entities
                // The optional fields nedded to be defined in the model and changes only one place
                const epicsFromDb: { id: string, name: string, shortDesc?:string, epicDesc?:string, priority?:number }[] | null = await retrieveEpics();
                setEpics(epicsFromDb!);
                setEpicsValid(true)
            })()
        }

    })
    return <>{children}</>;
}
