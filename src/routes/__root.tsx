import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Controls } from '../components/Controls'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          All Tasks
        </Link>{' '}
        <Link to="/myTasks" className="[&.active]:font-bold">
          My Tasks
        </Link>{' '}
        <Link to="/teacher" className="[&.active]:font-bold">
          Teacher
        </Link>{' '}
        <Link to="/janitor" className="[&.active]:font-bold">
          Janitor
        </Link>
      </div>
      <Controls />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
