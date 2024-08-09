"use client";
import { useFormStatus } from "react-dom";
import { deleteTask } from "@/actions";
import {useState} from "react";


// @ts-ignore
export const EditButton = ({ onToggleEdit }) => {
    const [isEditable, setIsEditable] = useState(false);

    const handleEditClick = () => {
        const newEditableState = !isEditable;
        setIsEditable(newEditableState);
        onToggleEdit(newEditableState);
    };

    return (
        <button
            onClick={handleEditClick}
            className="bg-blue-500 text-white p-2 rounded mb-4"
        >
            {isEditable ? 'Save' : 'Edit'}
        </button>
    );
};

export function AddTaskSubmit( props: { text?: string ,pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? props.pendingText|| "Creating..." : props.text || "Create"}
    </button>
  );
}


export const EditableGridActionButton = (params:any) => {
    const id: number = params.data.id;
    const onDeleteButtonClick = () => {
        console.log(`onButtonClick ${id}`);
        deleteTask(id);
    };

    // @ts-ignore
    function onAddButtonClick(event: MouseEvent<HTMLButtonElement>): void {
        //throw new Error("Function not implemented.");
        console.log(`onAddButtonClick ${id}`);
    }

    // add row under the task for the same task
    // @ts-ignore
    function onCarryonverButtonClick(event: MouseEvent<HTMLButtonElement>): void {
        //throw new Error("Function not implemented.");
        console.log(`onCarryonverButtonClick ${id}`);
    }

    return (
        // TODO Why is this not working?
        <div
            style={{
                display: "flex",
                alignItems: "left",
                marginLeft: "0px",
                marginRight: "2px",
                marginTop: "2px",
                marginBottom: "2px",
                gap: "4px",
                // Doesn't work
                fontSize: "16px",
            }}
        >
            <button onClick={onDeleteButtonClick} className="op">
                delete
            </button>
            <button onClick={onAddButtonClick} className="op">
                add
            </button>
            <button onClick={onCarryonverButtonClick} className="op">
                carryover
            </button>
        </div>
    );
}


export function GridActionButton(params: any) {
  const onDeleteButtonClick = () => {
    // TODO Why do we have object here ?
    console.log(`onButtonClick ${params.taskId}`);
    deleteTask(params.taskId);
  };

  // Add row under the task with new task
  // @ts-ignore
    function onAddButtonClick(event: MouseEvent<HTMLButtonElement>): void {
    //throw new Error("Function not implemented.");
    console.log(`onAddButtonClick ${params?.taskId}`);
  }

  // add row under the task for the same task
  // @ts-ignore
    function onCarryonverButtonClick(event: MouseEvent<HTMLButtonElement>): void {
    //throw new Error("Function not implemented.");
    console.log(`onCarryonverButtonClick ${params?.taskId}`);
  }

  return (
    // TODO Why is this not working?
    <div
      style={{
        display: "flex",
        alignItems: "left",
        marginLeft: "0px",
        marginRight: "2px",
        marginTop: "2px",
        marginBottom: "2px",
        gap: "4px",
        // Doesn't work
        fontSize: "16px",
      }}
    >
      <button onClick={onDeleteButtonClick} className="op">
        delete
      </button>
      <button onClick={onAddButtonClick} className="op">
        add
      </button>
      <button onClick={onCarryonverButtonClick} className="op">
        carryover
      </button>
    </div>
  );
}
