import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { fetchAll, fetchSettings } from "@/lib/api";
import { chipClass, shortDate } from "@/lib/hub";
import { EmptyState, PageHeader } from "@/components/hub/common";
import { StreamDialog } from "@/components/hub/dialogs";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/streams/")({
  head: () => ({
    meta: [
      { title: "Stream Planner — J4denTV Creator Hub" },
      { name: "description", content: "Plan upcoming J4denTV streams and keep ideas organised." },
      { property: "og:title", content: "Stream Planner — J4denTV Creator Hub" },
      {
        property: "og:description",
        content: "Plan upcoming J4denTV streams and keep ideas organised.",
      },
    ],
  }),
  component: StreamPlanner,
});

function StreamPlanner() {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const { data: streams = [], isLoading } = useQuery({
    queryKey: ["streams"],
    queryFn: () => fetchAll("streams", { orderBy: "stream_date", ascending: true }),
  });

  return (
    <div>
      <PageHeader
        title="Stream Planner"
        subtitle="Plan upcoming J4denTV streams and keep ideas organised."
        action={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" /> Plan Stream
          </Button>
        }
      />
      {creating ? (
        <StreamDialog
          open
          onOpenChange={() => setCreating(false)}
          defaultPlatform={settings?.default_platform ?? "Twitch"}
        />
      ) : null}

      {!isLoading && streams.length === 0 ? (
        <EmptyState
          title="No streams planned yet."
          action={<Button onClick={() => setCreating(true)}>Plan your first stream</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {streams.map((s: any) => (
            <button
              key={s.id}
              type="button"
              onClick={() => navigate({ to: "/streams/$streamId", params: { streamId: s.id } })}
              className="panel panel-hover p-5 text-left"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">🔴 {s.platform}</span>
                <span className={chipClass(s.status)}>{s.status}</span>
              </div>
              <p className="mt-3 font-medium">{s.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {shortDate(s.stream_date)}
                {s.stream_time ? ` — ${s.stream_time}` : ""}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{s.category}</p>
              {s.main_idea ? (
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{s.main_idea}</p>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
