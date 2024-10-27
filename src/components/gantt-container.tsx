"use client";
import {Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption} from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import {TaskListHeaderDefault} from "gantt-task-react/dist/components/task-list/task-list-header";
import classes from "./gantt-container.module.css";

export default function GanttContainer(rows: any) {
    const tasks: Task[] = rows.tasks.map((row: any) => {
        return {
            start: row.startDate,
            end: row.endDate,
            name: row.name,
            id: row.id,
            type: 'task',
            progress: 0,
            isDisabled: true,
            styles: {progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d'},
        };
    });

    //TODO This does not work as expected
// Custom TaskListTable component
    const CustomTaskListTable: React.FC<{
        rowHeight: number;
        rowWidth: string;
        fontFamily: string;
        fontSize: string;
        locale: string;
        tasks: Task[];
        selectedTaskId: string;
        setSelectedTask: (taskId: string) => void;
    }> = (props) => {
        const formatDate = (date: Date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            return `${day}-${month}`;
        };

        return (
            <div>
                {props.tasks.map((task) => (
                    <div key={task.id} style={{ height: props.rowHeight }}>
                        <span>{task.name}</span>
                        <span>{formatDate(task.start)}</span>
                        <span>{formatDate(task.end)}</span>
                    </div>
                ))}
            </div>
        );
    };

    const stylingOptions: StylingOption = {
        TaskListTable: CustomTaskListTable, // Assign the custom component here
    };



    return (
        <div style={{height: '100%', width: '100%' }} className={classes.ganttStyle}>
            <Gantt
                viewMode={ViewMode.Week}
                tasks={tasks}
                >
            </Gantt>

        </div>

    );
}