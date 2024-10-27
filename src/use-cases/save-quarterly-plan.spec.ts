// src/use-cases/save-quarterly-plan.spec.ts
import 'reflect-metadata';
import container from "@/model/inversify.config";
import { TYPES } from "@/model/container";
import { ISprintRepository, ISaveQuarterlyPlanUseCase } from "@/model/types";

// Create mock implementations
const mockQuarterlyUpsert = jest.fn().mockResolvedValue(undefined);
const mockCommitmentUpsert = jest.fn().mockResolvedValue(undefined);

// Mock the repositories before importing the use case
jest.mock('@/db', () => ({
    SQLLiteQuartersRepository: jest.fn().mockImplementation(() => ({
        upsert: mockQuarterlyUpsert // jest.fn().mockResolvedValue(undefined)
    })),
    SQLLiteQuarterOwnerCommitmentRepository: jest.fn().mockImplementation(() => ({
        upsert: mockCommitmentUpsert //jest.fn().mockResolvedValue(undefined)
    }))
}), { virtual: true });

import * as process from "node:process";
import {inject} from "inversify";

describe('saveQuarterlyPlanUseCase', () => {
    let sprintRepository: ISprintRepository;
    let saveQuarterlyPlanUseCase: ISaveQuarterlyPlanUseCase
    beforeEach(() => {
        jest.clearAllMocks();
        sprintRepository = container.get<ISprintRepository>(TYPES.SprintRepository);
        saveQuarterlyPlanUseCase = container.get<ISaveQuarterlyPlanUseCase>(TYPES.SaveQuarterlyPlanUseCase);

    });

    it('should create a quarter and sprints without any commitments', async () => {
        const testData = {
            quarterName: 'Q12024',
            year: '2024',
            quarter: 'Q1',
            firstMonth: 'Jan',
            sprintData: []
        };
        console.log(` Current environment: ${process.env.DI_ENV}`);
        // Act
        await saveQuarterlyPlanUseCase.saveQuarterlyPlan(testData);

        // Assert
        // Verify quarter was created with correct data
        expect(mockQuarterlyUpsert).toHaveBeenCalledWith({
            id: 'Q12024',
            year: '2024',
            quarter: 'Q1',
            firstMonth: 'Jan'
        });

        // Verify all 6 sprints were created
        expect(sprintRepository.upsert).toHaveBeenCalledTimes(6);

        // Verify first sprint data is correct
        expect(sprintRepository.upsert).toHaveBeenNthCalledWith(1, {
            id: 'S1Q12024',
            quarterId: 'Q12024',
            name: 'S1Q1'
        });

        // Verify last sprint data is correct
        expect(sprintRepository.upsert).toHaveBeenLastCalledWith({
            id: 'S6Q12024',
            quarterId: 'Q12024',
            name: 'S6Q1'
        });

        // Verify no commitments were created (empty sprintData)
        expect(mockCommitmentUpsert).not.toHaveBeenCalled();
    });

    it('should create commitments when sprintData is provided', async () => {
        // Arrange
        const testData = {
            quarterName: 'Q12024',
            year: '2024',
            quarter: 'Q1',
            firstMonth: 'Jan',
            sprintData: [{
                id: 'owner1',
                name: 'Thor',
                w1: 'epic1',
                w2: 'epic1'
            }]
        };

        // Act
        await saveQuarterlyPlanUseCase.saveQuarterlyPlan(testData);

        // Assert
        // Verify quarter and sprints were created
        expect(mockQuarterlyUpsert).toHaveBeenCalled();
        expect(sprintRepository.upsert).toHaveBeenCalledTimes(6);

        // Verify commitments were created
        expect(mockCommitmentUpsert).toHaveBeenCalledTimes(2); // Two weeks of commitments
        expect(mockCommitmentUpsert).toHaveBeenCalledWith({
            ownerId: 'owner1',
            epicId: 'epic1',
            sprintId: 'S1Q12024', // Both w1 and w2 should be in Sprint 1
            week: 'w1',
            quarterId: 'Q12024',
            commited: 1
        });
        expect(mockCommitmentUpsert).toHaveBeenCalledWith({
            ownerId: 'owner1',
            epicId: 'epic1',
            sprintId: 'S1Q12024',
            week: 'w2',
            quarterId: 'Q12024',
            commited: 1
        });
    });
});