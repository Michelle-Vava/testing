import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/owner/_layout/jobs/$jobId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/owner/_layout/jobs/$jobId-refactored"!</div>
}
