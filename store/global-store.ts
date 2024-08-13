import create from 'zustand';
interface GlobalStore {
    sprints: { id: string; name: string }[];
    setSprints: (sprints: { id: string; name: string }[]) => void;

    isSprintsValid: boolean;
    setSprintsValid: (isValid: boolean) => void;

    constraints: { name: string, value: number, project: string }[];
    setConstraints: (constraints: { name: string, value: number, project: string }[]) => void;
    isConstraintsValid: boolean;

    owners: { id: string, name: string }[];
    setOwners: (owners: { id: string, name: string }[]) => void;
    isOwnersValid: boolean;
    setOwnersValid: (isValid: boolean) => void;

}
export const useGlobalStore = create<GlobalStore>((set) => ({
    owners: [],
    sprints: [],
    constraints: [],
    setOwners: (owners) => set({ owners }),
    setSprints: (sprints) => set({ sprints }),
    setConstraints: (constraints) => set({ constraints }),
    isSprintsValid: false,
    setSprintsValid: (isValid) => set({ isSprintsValid: isValid }),
    isConstraintsValid: false,
    isOwnersValid: false,
    setOwnersValid: (isValid) => set({ isOwnersValid: isValid }),

}));

