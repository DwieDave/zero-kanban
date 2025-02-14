import { useTasks } from "../hooks/useTasks";
import type { RelatedTask } from "../schema";

export const TasksStatus = ({ filteredTasks }: { filteredTasks: RelatedTask[] }) => {
  const { hasFilters } = useTasks();
  return <em>
    {!hasFilters ? (
      <>Showing all {filteredTasks.length} tasks</>
    ) : (
      <>
        Showing {filteredTasks.length} of {filteredTasks.length}{" "}
        tasks. Try opening{" "}
        <a href="/" target="_blank" rel="noreferrer">
          another tab
        </a>{" "}
        to see them all!
      </>
    )}
  </em>
}
