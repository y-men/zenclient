"use client";
import { useGlobalStore } from "@/store/global-store";
import { retrieveActiveSprints, retrieveOwners, retrieveEpics } from "@/actions";
import { useEffect } from "react";

// @ts-ignore
export const HydrateGlobalStore = ({ children }) => {
    // Accessing state and actions from the global store
    const {
        owners, sprints, epics,
        setSprints, setOwners, setEpics,
        isSprintsValid, isOwnersValid, isEpicsValid,
        setSprintsValid, setOwnersValid, setEpicsValid
    } = useGlobalStore(state => ({
        owners: state.owners,
        sprints: state.sprints,
        epics: state.epics,
        setSprints: state.setSprints,
        setOwners: state.setOwners,
        setEpics: state.setEpics,
        isSprintsValid: state.isSprintsValid,
        isOwnersValid: state.isOwnersValid,
        isEpicsValid: state.isEpicsValid,
        setSprintsValid: state.setSprintsValid,
        setOwnersValid: state.setOwnersValid,
        setEpicsValid: state.setEpicsValid
    }));

    useEffect(() => {
        if (!isSprintsValid) {
            (async () => {
                const activeSprintsFromDb = await retrieveActiveSprints();
                setSprints(activeSprintsFromDb);
                setSprintsValid(true);
            })()
        }
        if (!isOwnersValid) {
            (async () => {
                const ownersFromDb = await retrieveOwners();
                setOwners(ownersFromDb);
                setOwnersValid(true)
            })()
        }
        if (!isEpicsValid) {
            (async () => {
                const epicsFromDb = await retrieveEpics();
                //@ts-expect-error
                setEpics(epicsFromDb);
                setEpicsValid(true)
            })()
        }
    }, [isSprintsValid, isOwnersValid, isEpicsValid ])

    return <>{children}</>;
}