import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/status/")({
  component: StatusPage,
});

function StatusPage() {
  
}
