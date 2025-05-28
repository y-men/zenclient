"use client";
import { useGlobalStore } from "@/store/global-store";
import {retrieveActiveSprints, retrieveOwners, retrieveEpics, retrieveConstraints} from "../actions";
import { useEffect } from "react";
import {inject} from "inversify";
import {TYPES} from "@/model/container";
import {IConstraintRepository, IConstraintUseCase, ISaveQuarterlyPlanUseCase} from "@/model/types";
import container from "@/model/inversify.config";

// @ts-ignore

export const HydrateGlobalStore = ({ children }) => {
    // Accessing state and actions from the global store
    const {
        owners, sprints, epics, constraints,
        setSprints, setOwners, setEpics,setConstraints,
        isSprintsValid, isOwnersValid, isEpicsValid,isConstraintsValid,
        setSprintsValid, setOwnersValid, setEpicsValid, setConstraintsValid
    } = useGlobalStore(state => ({
        owners: state.owners,
        sprints: state.sprints,
        epics: state.epics,
        constraints: state.constraints,
        setSprints: state.setSprints,
        setOwners: state.setOwners,
        setEpics: state.setEpics,
        setConstraints: state.setConstraints,
        isSprintsValid: state.isSprintsValid,
        isOwnersValid: state.isOwnersValid,
        isEpicsValid: state.isEpicsValid,
        isConstraintsValid: state.isConstraintsValid,
        setSprintsValid: state.setSprintsValid,
        setOwnersValid: state.setOwnersValid,
        setEpicsValid: state.setEpicsValid,
        setConstraintsValid: state.setConstraintsValid
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
        if( !isConstraintsValid){
            (async () => {
                const constraintsFromDb = await retrieveConstraints();
                //@ts-expect-error
                setConstraints(constraintsFromDb);
                setConstraintsValid(true)
            })()
        }

    }, [isSprintsValid, isOwnersValid, isEpicsValid, isConstraintsValid ])

    return <>{children}</>;
}