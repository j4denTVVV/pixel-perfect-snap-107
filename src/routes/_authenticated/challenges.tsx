import { createFileRoute } from "@tanstack/react-router";
import { HubItemsPage } from "@/components/hub/HubItemsPage";

export const Route = createFileRoute("/_authenticated/challenges")({
  head: () => ({ meta: [{ title: "Challenges — J4DENTV Creator HQ" }, { name: "robots", content: "noindex" }] }),
  component: () => <HubItemsPage kind="challenge" />,
});
