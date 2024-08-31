import create from 'zustand';
interface GlobalStore {
    sprints: { id: string; name: string }[];
    setSprints: (sprints: { id: string; name: string }[]) => void;

    isSprintsValid: boolean;
    setSprintsValid: (isValid: boolean) => void;

    constraints: { name: string, value: number, project: string }[];
    setConstraints: (constraints: { name: string, value: number, project: string }[]) => void;
    isConstraintsValid: boolean;
    setConstraintsValid: (isValid: boolean) => void;

    owners: { id: string, name: string }[];
    setOwners: (owners: { id: string, name: string }[]) => void;
    isOwnersValid: boolean;
    setOwnersValid: (isValid: boolean) => void;

    epics: { id: string, name: string, shortDesc?:string, epicDesc?:string, priority?:number }[];
    setEpics: (epics: { id: string, name: string, shortDesc?:string, epicDesc?:string, priority?:number }[]) => void;
    isEpicsValid: boolean;
    setEpicsValid: (isValid: boolean) => void;

}
export const useGlobalStore = create<GlobalStore>((set) => ({
    owners: [],
    sprints: [],
    constraints: [],
    epics: [],
    setOwners: (owners) => set({ owners }),
    setSprints: (sprints) => set({ sprints }),
    setConstraints: (constraints) => set({ constraints }),
    setEpics: (epics) => set({ epics }),
    isSprintsValid: false,
    setSprintsValid: (isValid) => set({ isSprintsValid: isValid }),
    isConstraintsValid: false,
    setConstraintsValid: (isValid) => set({ isConstraintsValid: isValid }),
    isOwnersValid: false,
    setOwnersValid: (isValid) => set({ isOwnersValid: isValid }),
    isEpicsValid: false,
    setEpicsValid: (isValid) => set({ isEpicsValid: isValid }),

}));

