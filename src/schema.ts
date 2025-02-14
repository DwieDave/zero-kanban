// These data structures define your client-side schema.
// They must be equal to or a subset of the server-side schema.
// Note the "relationships" field, which defines first-class
// relationships between tables.
// See https://github.com/rocicorp/mono/blob/main/apps/zbugs/src/domain/schema.ts
// for more complex examples, including many-to-many.

import {
  createSchema,
  definePermissions,
  type ExpressionBuilder,
  type Row,
  NOBODY_CAN,
  ANYONE_CAN,
  table,
  string,
  boolean,
  number,
  relationships,
  enumeration,
} from "@rocicorp/zero";


export type userType = "teacher" | "janitor";

const task = table("task")
  .columns({
    id: string(),
    assigneeID: string().from("assignee_id"),
    title: string(),
    body: string().optional(),
    state: enumeration<"todo" | "inprogress" | "done">(),
    order: number(),
    timestamp: number(),
    archived: number().optional()
  })
  .primaryKey("id");

const user = table("user")
  .columns({
    id: string(),
    type: enumeration<userType>(),
    admin: boolean(),
    name: string(),
  })
  .primaryKey("id");


const taskRelationships = relationships(task, ({ one }) => ({
  assignee: one({
    sourceField: ["assigneeID"],
    destField: ["id"],
    destSchema: user,
  }),
}));

export const schema = createSchema(1, {
  tables: [user, task],
  relationships: [taskRelationships],
});

export type Schema = typeof schema;
export type Task = Row<typeof schema.tables.task>;
export type User = Row<typeof schema.tables.user>;
export type RelatedTask = Task & { assignee?: User }

// The contents of your decoded JWT.
type AuthData = {
  sub: string | null;
  admin: boolean;
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
  const allowIfLoggedIn = (
    authData: AuthData,
    { cmpLit }: ExpressionBuilder<Schema, keyof Schema["tables"]>
  ) => cmpLit(authData.sub, "IS NOT", null);

  const allowIfAdmin = (
    authData: AuthData,
    { cmpLit, }: ExpressionBuilder<Schema, "user">
  ) => cmpLit(authData.admin, "=", true);

  return {
    user: {
      row: {
        insert: NOBODY_CAN,
        update: {
          preMutation: NOBODY_CAN,
        },
        delete: NOBODY_CAN,
      },
    },
    task: {
      row: {
        // anyone can insert
        insert: ANYONE_CAN,
        // only sender can edit their own messages
        update: {
          preMutation: [allowIfAdmin],
        },
        // must be logged in to delete
        delete: [allowIfLoggedIn, allowIfAdmin],
      },
    },
  };
});
