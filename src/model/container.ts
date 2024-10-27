// 1. First, set up the DI container types
// model/container.ts
export const TYPES = {

    QuarterRepository: Symbol.for('QuartersRepository'),
    SprintRepository: Symbol.for('SprintRepository'),
    CommitmentRepository: Symbol.for('QuarterOwnerCommitmentRepository'),

    SaveQuarterlyPlanUseCase: Symbol.for('SaveQuarterlyPlanUseCase')
};