//import React, { useState } from 'react';

"use client";
import {ActionSubmitButton, EditButton} from "@/components/grid-action-submit";
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
            // constraints?.forEach((constraint) => {
            //     console.log(`zazzaz>> ${constraint.name}, ${constraint.value}  `);
            // });
            const initialData =
                constraints?.reduce((acc, constraint) => {
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
    return <div>
            <h1>Constraints Page</h1>
            <div className="flex justify-between p-5">
                <div className="w-1/2">
                    {/*<EditButton onToggleEdit={handleToggleEdit}/>*/}
                    <form className="mt-5" action={updateConstraintData}>
                        <ActionSubmitButton text={"Save"}/>
                        <hr className="my-3"/>
                        {Object.keys(data).map((key) => {
                            return <div className="form-group row" key={key}>
                                <div className="col-sm-8">
                                    <FormDataField key={key}
                                                   name={key}
                                                   displayName={key}
                                        // @ts-ignore
                                                   value={Number(data[key])}
                                                   desc={"Count the number of integration points required"}
                                                   onChange={hadleValueChange}/>

                                </div>
                            </div>
                        })}



                    </form>
                </div>
                <div className="w-1/2">
                    {/* Placeholder for additional content or actions */}
                </div>
            </div>
        </div>;
};

export default EffortPage;
