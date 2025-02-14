import { randBetween, randID, randInt } from "./rand";
import type { Task, User } from "./schema";

const requests = [
  "Hey guys, is the zero package ready yet?",
  "I tried installing the package, but it's not there.",
  "The package does not install...",
  "Hey, can you ask Aaron when the npm package will be ready?",
  "npm npm npm npm npm",
  "n --- p --- m",
  "npm wen",
  "npm package?",
];

const replies = [
  "It will be ready next week",
  "We'll let you know",
  "It's not ready - next week",
  "next week i think",
  "Didn't we say next week",
  "I could send you a tarball, but it won't work",
];

const titles = [
  "I'm a title",
  "Another title",
  "Yet another title",
  "And another title",
  "One more title",
  "Last title",
]

export function randomTask(
  users: readonly User[],
): Task {
  const id = randID();
  const timestamp = randBetween(1727395200000, new Date().getTime());
  const isRequest = randInt(10) <= 6;
  const messages = isRequest ? requests : replies;
  const assigneeID = users[randInt(users.length)].id;
  return {
    id,
    assigneeID,
    body: messages[randInt(messages.length)],
    title: titles[randInt(titles.length)],
    state: "todo",
    order: 10000,
    archived: null,
    timestamp,
  };
}
