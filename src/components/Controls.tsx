import { useState, type MouseEvent, useRef } from "react";
import { useZero, } from "@rocicorp/zero/react";
import { randInt } from "../rand";
import { randomTask } from "../test-data";
import { useInterval } from "../use-interval";
import type { Schema } from "../schema";
import Cookies from "js-cookie";
import { useTasks } from "../hooks/useTasks";
import { useAtom } from "jotai";

export const Controls = () => {
  const z = useZero<Schema>();
  const { users, allTasks, filters } = useTasks();
  const [_user, setFilterUser] = useAtom(filters.user);
  const [_text, setFilterText] = useAtom(filters.body);

  const [action, setAction] = useState<"add" | "remove" | undefined>(undefined);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  const deleteRandomTask = () => {
    if (allTasks.length === 0) {
      return false;
    }
    const index = randInt(allTasks.length);
    z.mutate.task.delete({ id: allTasks[index].id });

    return true;
  };

  const addRandomTask = () => {
    z.mutate.task.insert(randomTask(users));
    return true;
  };

  const handleAction = () => {
    if (action === "add") {
      return addRandomTask();
    }

    if (action === "remove") {
      return deleteRandomTask();
    }

    return false;
  };

  useInterval(
    () => {
      if (!handleAction()) {
        setAction(undefined);
      }
    },
    action !== undefined ? 1000 / 60 : null
  );

  const INITIAL_HOLD_DELAY_MS = 300;
  const handleAddAction = () => {
    addRandomTask();
    holdTimerRef.current = setTimeout(() => {
      setAction("add");
    }, INITIAL_HOLD_DELAY_MS);
  };

  const handleRemoveAction = (e: MouseEvent | React.TouchEvent) => {
    if (z.userID === "anon" && "shiftKey" in e && !e.shiftKey) {
      alert("You must be logged in to delete. Hold shift to try anyway.");
      return;
    }
    deleteRandomTask();

    holdTimerRef.current = setTimeout(() => {
      setAction("remove");
    }, INITIAL_HOLD_DELAY_MS);
  };

  const stopAction = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    setAction(undefined);
  };


  const toggleLogin = async () => {
    if (z.userID === "anon") {
      await fetch("/api/login");
    } else {
      Cookies.remove("jwt");
    }
    location.reload();
  };

  // If initial sync hasn't completed, these can be empty.
  if (!users.length) {
    return null;
  }

  const user = users.find((user) => user.id === z.userID)?.name ?? "anon";

  return (
    <>
      <div className="controls">
        <div>
          <button
            type="button"
            onMouseDown={handleAddAction}
            onMouseUp={stopAction}
            onMouseLeave={stopAction}
            onTouchStart={handleAddAction}
            onTouchEnd={stopAction}
          >
            Add Tasks
          </button>
          <button
            type="button"
            onMouseDown={handleRemoveAction}
            onMouseUp={stopAction}
            onMouseLeave={stopAction}
            onTouchStart={handleRemoveAction}
            onTouchEnd={stopAction}
          >
            Remove Tasks
          </button>
          <em>(hold down buttons to repeat)</em>
        </div>
        <div
          style={{
            justifyContent: "end",
          }}
        >
          {user === "anon" ? "" : `Logged in as ${user}`}
          <button type="button" onMouseDown={() => toggleLogin()}>
            {user === "anon" ? "Login" : "Logout"}
          </button>
        </div>
      </div>
      <div className="controls">
        <div>
          Assigned to:
          <select
            onChange={(e) => setFilterUser(e.target.value)}
            style={{ flex: 1 }}
          >
            <option key={""} value="">
              Assignee
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          Contains:
          <input
            type="text"
            placeholder="message"
            onChange={(e) => setFilterText(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
      </div>
    </>)
}
