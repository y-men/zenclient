/**
 * This file contains the use cases for the application.
 * The use cases are separated from the UI components to keep the business logic separate from the UI.
 * This is in line with the Clean Architecture principles:
 * https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
 */

import {SQLLiteQuarterOwnerCommitmentRepository, SQLLiteQuartersRepository, SQLLiteSprintRepository} from "@/db";
import { TYPES } from '@/model/container';
import container from "@/model/inversify.config";
import {
    IConstraint,
    type IConstraintRepository,
    IConstraintUseCase,
    ISaveQuarterlyPlanData,
    ISaveQuarterlyPlanUseCase,
    type ISprintRepository,
} from "@/model/types";
import {inject, injectable} from "inversify";


/**
 * Handling of constraints
 */
@injectable()
export class ConstraintUseCase implements IConstraintUseCase {
    // @ts-ignore
    @inject(TYPES.ConstraintRepository) private constraintRepository: IConstraintRepository;
    public async getAllConstraints(): Promise<IConstraint[]> {
        const constraints = await this.constraintRepository.getAll();
        return constraints || [];
    }

}
/**
 * Handling of quartely plan data
 */
@injectable()
export class SaveQuarterlyPlanUseCase implements ISaveQuarterlyPlanUseCase {

    //@ts-ignore
    @inject(TYPES.SprintRepository) private sprintRepository: ISprintRepository;

    private quarterlyRepository = new SQLLiteQuartersRepository();
    private quarterOwnerCommitmentRepository = new SQLLiteQuarterOwnerCommitmentRepository();

    public calculateSprintFromWeek =  (week: string, year: string, quarter: string): string => {
        const weekNumber = parseInt(week.replace("w", ""));
        const sprintNumber = Math.ceil(weekNumber / 2);
        return `S${sprintNumber}${quarter}${year}`;
    }

    /**
     * Create the connections to the quarterly plan and save the data
     * The resulting would be all the data of the queterly plan and the individual commitments saved
     * @param data
     */
    public saveQuarterlyPlan =  async (data: ISaveQuarterlyPlanData): Promise<void> => {

        console.log(`   Saving Quarterly Plan: ${data.quarterName}`);
        console.dir(data);

        await this.quarterlyRepository.upsert({
            id: data.quarterName,
            year: data.year,
            quarter: data.quarter,
            firstMonth: data.firstMonth
        });

        // Add sprints for this quarter and sprint connections
        for (let i = 1; i <= 6; i++) {
            await this.sprintRepository.upsert({
                id: `S${i}${data.quarter}${data.year}`,
                quarterId: data.quarterName,
                name: `S${i}${data.quarter}`
            });
        }

        // Add the commitments
        for (const owner of data.sprintData) {
            const weekProperties = Object.keys(owner).filter(key => key.startsWith('w'));
            for (const week of weekProperties) {
                if (owner[week]) {
                    // Save only if there is a commitment
                    const sprintId: string = this.calculateSprintFromWeek(week, data.year, data.quarter)
                    const commitmentData = {
                        ownerId: owner.id,
                        epicId: owner[week],
                        sprintId: sprintId,
                        week: week,
                        quarterId: data.quarterName,
                        commited: 1
                    }
                    await this.quarterOwnerCommitmentRepository.upsert(commitmentData);
                }
            }
        }
//TODO Close prisma connection after all the operations

    }
}