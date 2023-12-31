import React from "react";
import { ITask } from "../../types";

const Task = ({ task }: { task: ITask }) => {

  return (
    <div className="item__info">
      <p>ID: {task.id}</p>
      <p>Name: {task.name}</p>
      <p>Description: {task.description}</p>
      <p>Start Date: {task.startDate}</p>
      <p>End Date: {task.endDate}</p>
      <p>Employee ID: {task.employeeId}</p>
    </div>
  );
};

export default Task;
