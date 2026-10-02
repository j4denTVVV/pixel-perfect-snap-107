import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/equipment")({
  beforeLoad: () => {
    throw redirect({ to: "/assets", search: { tab: "equipment" } });
  },
});
