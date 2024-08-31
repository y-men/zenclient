"use client";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {AddTaskSubmit} from "@/components/grid-action-submit";
import MDEditor, { commands } from "@uiw/react-md-editor"
import {dlog} from "@/utils";
import {addEpicFormAction} from "@/actions";
import {useGlobalStore} from "@/store/global-store";

//TODO Dynamic import of commands property

// const MDEditor = dynamic(
//     () => import("@uiw/react-md-editor"),
//     {ssr: false}
// );

// const MDEditor = dynamic(
//     () => import('@uiw/react-md-editor').then((mod) => mod.default),
//     { ssr: false }
// );
//
// const commands = dynamic(
//     // @ts-ignore
//     () => import('@uiw/react-md-editor').then((mod) => mod.commands),
//     { ssr: false }
// );


const formElements = [
    {name: "name", displayName: "Name:", value: ""},
    {name: "shortDescription", displayName: "Short Description:", value: ""},
    {name: "priority", displayName: "Priority:", value: 0, type: "number", min: 0, max: 9999, className: "form-control w-25"},
];

function getFormElement(
     {
        name,
        displayName,
        value,
        type = "text",
        min = 0,
        max = 9999,
        className = "form-control w-100"
    }: {
        name: string,
        displayName: string,
        value: number | string,
        type?: string,
        min?: number,
        max?: number,
        className?: string
    }

) {
    return <div className="row mb-3" key={name}>
        <div className="col-12 col-sm-3 col-md-2 mb-1">
            <label htmlFor="name" className="form-label">{displayName}</label>
        </div>
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            <input
                type={type}
                id={name}
                name={name}
                className={className}
                min={min}
                max={max}

            />
        </div>
    </div>;
}


export default function AddEpic() {
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState("");
    const setEpicsValid = useGlobalStore(state => state.setEpicsValid);

    const onCellValueChanged = useCallback((data: string) => {
        console.log('onCellValueChanged');
        console.log(data);
        setValue(data);
        if (hiddenInputRef.current) {
            hiddenInputRef.current.value = data;
        }
    }, []);

    // TODO: Better to invlidate the flag when the form is submitted ( Maybe this also causeign refresh issues )
    useEffect(() => {
        setEpicsValid(false);
    }, []);

    return (
        <div className="container-fluid mt-5">
            <h1>Add Epic</h1>
            <form className="mx-3 mt-4" action={addEpicFormAction}>
                <div className="mb-3">
                    <AddTaskSubmit text={"Save"} />
                </div>
                <hr className="my-3"/>
                {formElements.map((element) => getFormElement(element))}
                <input
                    type="hidden"
                    name="epicDescription"
                    ref={hiddenInputRef}
                />

                <div className="mb-3">
                    <label htmlFor="epicDescription" className="form-label">Description</label>
                    <MDEditor value={value}
                        //@ts-ignore
                              onChange={ onCellValueChanged}
                              commands={[
                                  commands.bold,
                                  commands.italic,
                              ]}
                    />
                </div>

            </form>
        </div>


    );
}

