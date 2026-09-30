import { createFileRoute } from "@tanstack/react-router";
import { HubItemsPage } from "@/components/hub/HubItemsPage";

export const Route = createFileRoute("/_authenticated/irl")({
  head: () => ({ meta: [{ title: "IRLs — J4DENTV Creator HQ" }, { name: "robots", content: "noindex" }] }),
  component: () => <HubItemsPage kind="irl" />,
});
