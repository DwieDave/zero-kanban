import type { FC } from "react";
import { useZero } from "@rocicorp/zero/react";
import { useTasks } from "../hooks/useTasks";
import type { userType, RelatedTask, Schema } from "../schema";
import { TasksStatus } from "./TasksStatus";
import { toTitleCase } from "../utils";
import { useMyId } from "../hooks/useMyId";



const states: RelatedTask['state'][] = ["todo", "inprogress", "done"] as const

export const Board: FC<{ userType: userType | "all" | "me" }> = ({ userType }) => {
  const { filteredTasks } = useTasks()

  let tasks: RelatedTask[] = []
  switch (userType) {
    case "me": {
      const myId = useMyId()
      tasks = filteredTasks.filter(task => task.assignee?.id === myId)
      break;
    }
    case "all":
      tasks = filteredTasks
      break;
    default:
      tasks = filteredTasks.filter(task => task.assignee?.type === userType)
  }

  return (
    <div className="p-2">
      <TasksStatus filteredTasks={tasks} />
      <hr />
      <TaskBoard tasks={tasks} />
    </div>
  )
}


const TaskBoard: FC<{ tasks: RelatedTask[] }> = ({ tasks }) => {
  const z = useZero<Schema>();

  const changeState = (task: RelatedTask, dir: 1 | -1) => {
    const newStateIndex = Math.max(0, Math.min((states.indexOf(task.state) + dir), states.length))
    z.mutate.task.update({
      id: task.id,
      state: states[newStateIndex]
    })
    return true
  }

  const archiveMessage = (message: RelatedTask) => {
    z.mutate.task.update({
      id: message.id,
      archived: Date.now()
    })
    return true
  }

  const BoardColumn: FC<{ state: RelatedTask['state'] }> = ({ state }) => {
    const filteredTasks = tasks.filter(m => m.state === state)
    return <div className="column">
      <h2>{toTitleCase(state)}</h2>
      {filteredTasks.map(task => <Task task={task} key={task.id} />)}
    </div>
  }

  const Task: FC<{ task: RelatedTask }> = ({ task }) => {
    return <div className="task" >
      <div className="info">
        <div><code>@{task.assignee?.name}</code></div>
        <div><code>{new Date(task.timestamp).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" })}</code></div>
      </div>
      <div className="content">
        <div className="title">{task.title}</div>
        <div className="body">{task.body}</div>
      </div>
      <div className="controls">
        <button type="button" disabled={states.at(0) === task.state} onMouseDown={() => changeState(task, -1)}>⬅️</button>
        <button type="button" disabled={states.at(-1) === task.state} onMouseDown={() => changeState(task, 1)}>➡️</button>
        <button type="button" onMouseDown={() => archiveMessage(task)} style={{ marginLeft: "auto" }}>🗃️</button>
      </div>
    </div>
  }

  return <div className="board">
    <BoardColumn state="todo" />
    <BoardColumn state="inprogress" />
    <BoardColumn state="done" />
  </div>
}
