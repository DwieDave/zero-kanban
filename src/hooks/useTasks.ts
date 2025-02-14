import { escapeLike } from "@rocicorp/zero";
import { useZero, useQuery } from "@rocicorp/zero/react";
import type { Schema } from "../schema";
import { atom, useAtom } from "jotai";


const filterUserState = atom<string>("");
const filterBodyState = atom<string>("");

export const useTasks = () => {
  const z = useZero<Schema>();
  const [users] = useQuery(z.query.user);

  const [filterUser] = useAtom(filterUserState);
  const [filterText] = useAtom(filterBodyState);

  const all = z.query.task
    .related("assignee")
    .where(({ exists }) => exists('assignee'));


  let filtered = all
    .where("archived", "IS", null)
    .orderBy("timestamp", "desc")

  const [allTasks] = useQuery(all);

  if (filterUser) {
    filtered = filtered.where("assigneeID", filterUser);
  }

  if (filterText) {
    const escaped = `%${escapeLike(filterText)}%`
    filtered = filtered.where(({ cmp, or }) =>
      or(cmp("body", "LIKE", escaped), cmp("title", "LIKE", escaped)))
  }

  const [filteredTasks] = useQuery(filtered);
  const hasFilters = filterUser || filterText;

  return {
    myId: z.userID,
    users,
    allTasks,
    filteredTasks,
    hasFilters,
    filters: {
      user: filterUserState,
      body: filterBodyState
    }
  } as const
}
