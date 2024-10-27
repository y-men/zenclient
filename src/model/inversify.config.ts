// model/inversify.config.ts
import 'reflect-metadata';
import {Container, injectable} from 'inversify';
import { TYPES } from './container';
import {ISprint, ISprintRepository, ISaveQuarterlyPlanUseCase } from "@/model/types";
import { SQLLiteSprintRepository } from "@/db";
import SaveQuarterlyPlanUseCase  from "@/use-cases";
import {Promise} from "@sinclair/typebox";

const container = new Container({
    defaultScope: 'Singleton'
});

const env = process.env.DI_ENV || 'development';
container.bind<ISaveQuarterlyPlanUseCase>(TYPES.SaveQuarterlyPlanUseCase).to(SaveQuarterlyPlanUseCase);

if (env === 'development') {
    container.bind<ISprintRepository>(TYPES.SprintRepository)
        .to(SQLLiteSprintRepository)
        .inSingletonScope();  // Changed to singleton
} else {

    @injectable()
    class MockSprintRepository implements ISprintRepository {
        upsert = jest.fn().mockResolvedValue(undefined);
        create= jest.fn().mockResolvedValue(undefined);
        getAll= jest.fn().mockResolvedValue(undefined);
        getById= jest.fn().mockResolvedValue(undefined);
    }

    container.bind<ISprintRepository>(TYPES.SprintRepository)
        .to(MockSprintRepository)
        .inSingletonScope();  // Changed to singleton
}

export default container;