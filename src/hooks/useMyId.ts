import { useZero } from "@rocicorp/zero/react";
import type { Schema } from "../schema";

export const useMyId = () => {
  const z = useZero<Schema>();
  return z.userID
}
