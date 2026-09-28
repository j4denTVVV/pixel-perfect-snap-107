import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { fetchAll, fetchSettings } from "@/lib/api";
import { chipClass, daysUntil, formatNumber, percentChange, shortDate } from "@/lib/hub";
import { PageHeader, ProgressRow, StatCard } from "@/components/hub/common";
import { QuickAdd } from "@/components/hub/AppShell";
import { CalendarBoard, type CalendarItem } from "@/components/hub/CalendarBoard";
import { SocialsCard } from "@/components/hub/Socials";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Overview — J4denTV Creator Hub" },
      { name: "description", content: "Monthly progress, upcoming content and reminders." },
      { property: "og:title", content: "Overview — J4denTV Creator Hub" },
      { property: "og:description", content: "Monthly progress, upcoming content and reminders." },
    ],
  }),
  component: Overview,
});

function inMonth(value: string | null | undefined, monthOffset: number) {
  if (!value) return false;
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const d = new Date(value);
  return d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth();
}

function Overview() {
  const navigate = useNavigate();
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const { data: videos = [] } = useQuery({
    queryKey: ["youtube_videos"],
    queryFn: () => fetchAll("youtube_videos"),
  });
  const { data: streams = [] } = useQuery({
    queryKey: ["streams"],
    queryFn: () => fetchAll("streams"),
  });
  const { data: goals = [] } = useQuery({ queryKey: ["goals"], queryFn: () => fetchAll("goals") });
  const { data: analytics = [] } = useQuery({
    queryKey: ["analytics_entries"],
    queryFn: () => fetchAll("analytics_entries"),
  });

  const monthly = analytics.filter((a: any) => a.period === "monthly");
  const sum = (offset: number, key: string) =>
    monthly
      .filter((a: any) => inMonth(a.period_start, offset))
      .reduce((acc: number, a: any) => acc + (Number(a[key]) || 0), 0);

  const videosThis = videos.filter((v: any) => inMonth(v.actual_upload_date, 0)).length;
  const videosLast = videos.filter((v: any) => inMonth(v.actual_upload_date, -1)).length;
  const streamsThis = streams.filter(
    (s: any) => s.status === "Live Completed" && inMonth(s.stream_date, 0),
  ).length;
  const streamsLast = streams.filter(
    (s: any) => s.status === "Live Completed" && inMonth(s.stream_date, -1),
  ).length;
  const postsThis = sum(0, "posts");
  const postsLast = sum(-1, "posts");
  const viewsThis = sum(0, "views");
  const viewsLast = sum(-1, "views");
  const followersThis = sum(0, "followers_gained");

  const monthName = new Date().toLocaleDateString("en-GB", { month: "long" });

  const upcoming = [
    ...videos
      .filter((v: any) => (daysUntil(v.planned_record_date) ?? -1) >= 0)
      .map((v: any) => ({
        id: v.id,
        kind: "video" as const,
        title: v.working_title,
        when: `Recording: ${shortDate(v.planned_record_date)}`,
        status: v.status,
        date: v.planned_record_date,
      })),
    ...streams
      .filter((s: any) => (daysUntil(s.stream_date) ?? -1) >= 0 && s.status !== "Cancelled")
      .map((s: any) => ({
        id: s.id,
        kind: "stream" as const,
        title: s.title,
        when: `${shortDate(s.stream_date)}${s.stream_time ? ` — ${s.stream_time}` : ""}`,
        status: s.status,
        date: s.stream_date,
      })),
  ]
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(0, 6);

  const reminders: string[] = [];
  upcoming.forEach((item) => {
    const d = daysUntil(item.date);
    if (d === 0) reminders.push(`${item.title} is today.`);
    else if (d === 1) reminders.push(`${item.title} is tomorrow.`);
    else if (d !== null && d <= 3) reminders.push(`${item.title} is in ${d} days.`);
  });
  if (!monthly.some((a: any) => inMonth(a.period_start, 0))) {
    reminders.push("Your monthly analytics haven't been entered yet.");
  }

  const calendarItems: CalendarItem[] = [
    ...videos
      .filter((v: any) => v.planned_upload_date)
      .map((v: any) => ({
        date: v.planned_upload_date,
        label: v.working_title,
        kind: "upload" as const,
        onOpen: () => navigate({ to: "/youtube/$videoId", params: { videoId: v.id } }),
      })),
    ...videos
      .filter((v: any) => v.planned_record_date)
      .map((v: any) => ({
        date: v.planned_record_date,
        label: `Record: ${v.working_title}`,
        kind: "record" as const,
        onOpen: () => navigate({ to: "/youtube/$videoId", params: { videoId: v.id } }),
      })),
    ...streams
      .filter((s: any) => s.stream_date)
      .map((s: any) => ({
        date: s.stream_date,
        label: s.title,
        kind: "stream" as const,
        onOpen: () => navigate({ to: "/streams/$streamId", params: { streamId: s.id } }),
      })),
    ...goals
      .filter((g: any) => g.deadline)
      .map((g: any) => ({
        date: g.deadline,
        label: g.name,
        kind: "goal" as const,
        onOpen: () => navigate({ to: "/goals" }),
      })),
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${settings?.greeting_name ?? "Jaden"}.`}
        subtitle={`Here's what's happening with ${settings?.creator_name ?? "J4denTV"}.`}
        action={<QuickAdd />}
      />

      <div className="mb-6">
        <SocialsCard />
      </div>


      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="YouTube Videos"
          value={videosThis}
          caption="Uploaded this month"
          delta={percentChange(videosThis, videosLast)}
        />
        <StatCard
          label="Streams"
          value={streamsThis}
          caption="Completed this month"
          delta={percentChange(streamsThis, streamsLast)}
        />
        <StatCard
          label="Short-Form Posts"
          value={postsThis}
          caption="Posted this month"
          delta={percentChange(postsThis, postsLast)}
        />
        <StatCard
          label="Total Views"
          value={viewsThis}
          caption="Across tracked platforms"
          delta={percentChange(viewsThis, viewsLast)}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="panel p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="section-title text-lg">{monthName} Progress</h2>
            <Link to="/settings" className="text-xs text-muted-foreground hover:text-foreground">
              Edit targets
            </Link>
          </div>
          <div className="space-y-5">
            <ProgressRow
              label="YouTube Videos"
              current={videosThis}
              target={settings?.target_videos ?? 4}
            />
            <ProgressRow
              label="Streams"
              current={streamsThis}
              target={settings?.target_streams ?? 8}
            />
            <ProgressRow label="Shorts" current={postsThis} target={settings?.target_shorts ?? 20} />
            <ProgressRow
              label="Followers Gained"
              current={followersThis}
              target={settings?.target_followers ?? 2000}
            />
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="section-title mb-4 flex items-center gap-2 text-lg">
            <Bell className="size-4 text-primary" /> Reminders
          </h2>
          {reminders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing needs attention right now.</p>
          ) : (
            <ul className="space-y-3">
              {reminders.slice(0, 6).map((r) => (
                <li key={r} className="rounded-lg bg-surface px-3 py-2 text-sm">
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="section-title mb-4 text-lg">Coming Up</h2>
        {upcoming.length === 0 ? (
          <div className="panel px-6 py-10 text-center text-sm text-muted-foreground">
            Nothing planned yet. Use Quick Add to plan a video or stream.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((item) => (
              <button
                key={`${item.kind}-${item.id}`}
                type="button"
                onClick={() =>
                  item.kind === "video"
                    ? navigate({ to: "/youtube/$videoId", params: { videoId: item.id } })
                    : navigate({ to: "/streams/$streamId", params: { streamId: item.id } })
                }
                className="panel panel-hover p-5 text-left"
              >
                <p className="text-xs text-muted-foreground">
                  {item.kind === "video" ? "🎬 YouTube" : "🔴 Stream"}
                </p>
                <p className="mt-2 font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.when}</p>
                <span className={`${chipClass(item.status)} mt-3`}>{item.status}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="section-title mb-4 text-lg">Content Calendar</h2>
        <CalendarBoard items={calendarItems} />
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Tracked followers gained this month: {formatNumber(followersThis)}
      </p>
    </div>
  );
}
