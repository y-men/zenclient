//import React, { useState } from 'react';

"use client";
import {AddTaskSubmit, EditButton} from "@/components/grid-action-submit";
//import { AddTaskSubmit } from "@/components/grid-action-submit";
import {retrieveConstraints, updateConstraintData} from "@/actions";
import {useEffect, useState} from "react";
import FormDataField from "@/components/form-data-field";

let constraints: ({ name: string; value: number; project: string }[] | null);

const findValueByName = async (name: string) => {
    if (!constraints) {
        constraints = await retrieveConstraints();
    }
    const c = constraints!.find(constraint => constraint.name === name);
    return String(c?.value);
}


const EffortPage = () => {

    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            constraints = await retrieveConstraints();

            constraints?.forEach((constraint) => {
                console.log(`zazzaz>> ${constraint.name}, ${constraint.value}  `);
            });
            const initialData =
                constraints?.reduce((acc, constraint) => {
                    console.log(`qqqq>> ${constraint.name}, ${constraint.value}  `);
                    // @ts-ignore
                    acc [constraint.name] = constraint.value;
                    return acc;
                }, {} as any);
            setData(initialData!)
        };
        fetchData();
    }, []);

    const hadleValueChange = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    // todo Scroll only the form no the whole page
    return (<div>
            <h1>Constraints Page</h1>
            <div className="flex justify-between p-5">
                <div className="w-1/2">
                    {/*<EditButton onToggleEdit={handleToggleEdit}/>*/}
                    <form className="mt-5" action={updateConstraintData}>


                        <FormDataField name={"integrationPoints"}
                                       displayName={"Integration Points"}
                            // @ts-ignore
                                       value={data.integrationPoints}
                                       desc={"Count the number of integration points required"}
                                       onChange={hadleValueChange}/>
                        <FormDataField name={"ktlo"}
                            // @ts-ignore

                                       value={data.ktlo}
                                       displayName={"KTLO"}
                                       desc={"Keep The Lights On: Estimate the percentage of time allocated to maintenance tasks."}
                                       onChange={hadleValueChange}/>
                        <FormDataField name={"technicalDebt"}
                                       displayName={"Technical Debt"}
                            // @ts-ignore

                                       value={data.technicalDebt}
                                       desc={"Estimate the level of technical debt on a scale of 1-5"}
                                       onChange={hadleValueChange}/>
                        <FormDataField name={"contingency"}
                                       displayName={"Contingency %"}
                            // @ts-ignore

                                       value={data.contingency}
                                       desc={"This is a percentage buffer added to the estimated time to account for unforeseen issues or risks"}
                                       onChange={hadleValueChange}/>
                        <FormDataField name={"integrationPoints"}
                                       displayName={"Integration Points"}
                            // @ts-ignore

                                       value={data.includeMood}
                                       desc={"The motivation and morale of the team members (1-5)"}
                                       onChange={hadleValueChange}/>
                        <FormDataField name={"activeSprintDays"}
                                       displayName={"Active Sprint Days"}
                            // @ts-ignore

                                       value={data.activeSprintDays}
                                       desc={"The number of days within a sprint that are actually available for productive work"}
                                       onChange={hadleValueChange}/>
                        <FormDataField name={"teamMembers"}
                                       displayName={"Team Members"}
                            // @ts-ignore

                                       value={data.teamMembers}
                                       desc={"This refers to the number of individuals assigned to work on a specific task or project. "}
                                       onChange={hadleValueChange}/>
                        {/* Add more fields as necessary */}
                        <AddTaskSubmit text={"Save"}/>
                    </form>
                </div>
                <div className="w-1/2">
                    {/* Placeholder for additional content or actions */}
                </div>
            </div>
        </div>

    );
};

export default EffortPage;
