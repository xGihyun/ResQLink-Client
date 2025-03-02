import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/nearby/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/nearby/"!</div>;
}
