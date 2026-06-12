import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/occasions")({
  component: () => <Outlet />,
});
