// model/inversify.config.ts
import 'reflect-metadata';
import {Container, injectable} from 'inversify';
import {TYPES} from './container';
import {IConstraintRepository, ISaveQuarterlyPlanUseCase, ISprintRepository} from "@/model/types";
import {SQLLiteConstraintRepository, SQLLiteSprintRepository} from "@/db";
import {ConstraintUseCase, SaveQuarterlyPlanUseCase} from "@/use-cases";

const container = new Container({
    defaultScope: 'Singleton'
});

const env = process.env.DI_ENV || 'development';
container.bind<ISaveQuarterlyPlanUseCase>(TYPES.SaveQuarterlyPlanUseCase).to(SaveQuarterlyPlanUseCase);
container.bind<ConstraintUseCase>(TYPES.ConstraintUseCase).to(ConstraintUseCase);

if (env === 'development') {
    container.bind<IConstraintRepository>(TYPES.ConstraintRepository).to(SQLLiteConstraintRepository).inSingletonScope()
    container.bind<ISprintRepository>(TYPES.SprintRepository).to(SQLLiteSprintRepository).inSingletonScope();
} else {

    @injectable()
    class MockSprintRepository implements ISprintRepository {
        upsert = jest.fn().mockResolvedValue(undefined);
        create = jest.fn().mockResolvedValue(undefined);
        getAll = jest.fn().mockResolvedValue(undefined);
        getById = jest.fn().mockResolvedValue(undefined);
    }

    container.bind<ISprintRepository>(TYPES.SprintRepository)
        .to(MockSprintRepository)
        .inSingletonScope();  // Changed to singleton
}

export default container;