import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  CalendarDays,
  Clapperboard,
  Clock3,
  Handshake,
  Headphones,
  Home,
  Lightbulb,
  LogOut,
  MapPin,
  Menu,
  MonitorUp,
  Plus,
  Radio,
  Search,
  Settings as SettingsIcon,
  Target,
  Trophy,
  Video,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { fetchAll, fetchSettings } from "@/lib/api";
import {
  AnalyticsDialog,
  GoalDialog,
  IdeaDialog,
  StreamDialog,
  VideoDialog,
} from "@/components/hub/dialogs";

const NAV = [
  {
    label: "Plan",
    items: [
      { to: "/dashboard", label: "Overview", icon: Home },
      { to: "/calendar", label: "Calendar", icon: CalendarDays },
      { to: "/youtube", label: "YouTube", icon: Video },
      { to: "/streams", label: "Streams", icon: Radio },
      { to: "/ideas", label: "Ideas", icon: Lightbulb },
    ],
  },
  {
    label: "Productions",
    items: [
      { to: "/challenges", label: "Challenges", icon: Trophy },
      { to: "/marathons", label: "Marathons", icon: Clock3 },
      { to: "/subathons", label: "Subathons", icon: Headphones },
      { to: "/collabs", label: "Collabs", icon: Handshake },
      { to: "/irl", label: "IRLs", icon: MapPin },
      { to: "/overlays", label: "Overlays", icon: MonitorUp },
      { to: "/equipment", label: "Equipment", icon: Clapperboard },
    ],
  },
  {
    label: "Track",
    items: [
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/goals", label: "Goals", icon: Target },
      { to: "/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-6">
      {NAV.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-sidebar-muted">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map(({ to, label, icon: Icon }) => {
              const active = pathname === to || pathname.startsWith(`${to}/`);
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={onNavigate}
                  className={`group flex items-center gap-3 border-l px-3 py-2 text-sm transition-all ${
                    active
                      ? "border-primary bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "border-transparent text-muted-foreground hover:border-sidebar-border hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon className={`size-4 ${active ? "text-primary" : "group-hover:text-primary"}`} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Brand({ name }: { name: string }) {
  return (
    <div className="border-b border-sidebar-border px-3 pb-5 pt-4">
      <p className="section-title text-shine text-2xl">{name}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="h-px w-5 bg-primary/60" />
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-sidebar-muted">4TV Creator HQ</p>
      </div>
    </div>
  );
}

export function QuickAdd({ label = "Quick Add" }: { label?: string }) {
  const [open, setOpen] = useState<null | "video" | "stream" | "idea" | "analytics" | "goal">(null);
  const close = () => setOpen(null);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus className="size-4" /> {label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen("video")}>YouTube video</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen("stream")}>Stream</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen("idea")}>Idea</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen("analytics")}>Analytics entry</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen("goal")}>Goal</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {open === "video" ? <VideoDialog open onOpenChange={close} /> : null}
      {open === "stream" ? <StreamDialog open onOpenChange={close} /> : null}
      {open === "idea" ? <IdeaDialog open onOpenChange={close} /> : null}
      {open === "analytics" ? <AnalyticsDialog open onOpenChange={close} /> : null}
      {open === "goal" ? <GoalDialog open onOpenChange={close} /> : null}
    </>
  );
}

function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: videos = [] } = useQuery({
    queryKey: ["youtube_videos"],
    queryFn: () => fetchAll("youtube_videos"),
  });
  const { data: streams = [] } = useQuery({ queryKey: ["streams"], queryFn: () => fetchAll("streams") });
  const { data: ideas = [] } = useQuery({ queryKey: ["ideas"], queryFn: () => fetchAll("ideas") });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
        <Search className="size-4" />
        <span className="hidden sm:inline text-muted-foreground">Search everything</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search videos, streams and ideas..." />
        <CommandList>
          <CommandEmpty>Nothing found.</CommandEmpty>
          <CommandGroup heading="YouTube videos">
            {videos.map((v: any) => (
              <CommandItem
                key={v.id}
                value={`${v.working_title} ${v.final_title ?? ""} ${v.category}`}
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: "/youtube/$videoId", params: { videoId: v.id } });
                }}
              >
                🎬 {v.working_title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Streams">
            {streams.map((s: any) => (
              <CommandItem
                key={s.id}
                value={`${s.title} ${s.category} ${s.platform}`}
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: "/streams/$streamId", params: { streamId: s.id } });
                }}
              >
                🔴 {s.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Ideas">
            {ideas.map((i: any) => (
              <CommandItem
                key={i.id}
                value={`${i.title} ${i.description ?? ""} ${(i.tags ?? []).join(" ")}`}
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: "/ideas" });
                }}
              >
                💡 {i.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const creatorName = settings?.creator_name ?? "J4denTV";

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/hq", replace: true });
  };

  return (
    <div className="hub-shell min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-3 py-2 lg:flex">
        <Brand name={creatorName} />
        <div className="flex-1 overflow-y-auto py-6">
          <NavLinks />
        </div>
        <Button variant="ghost" className="justify-start border-t border-sidebar-border text-muted-foreground" onClick={signOut}>
          <LogOut className="size-4" /> Lock Hub
        </Button>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 overflow-y-auto border-sidebar-border bg-sidebar p-3">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Brand name={creatorName} />
                <div className="py-6"><NavLinks onNavigate={() => setMobileNavOpen(false)} /></div>
                <Button
                  variant="ghost"
                  className="mt-4 w-full justify-start text-muted-foreground"
                  onClick={signOut}
                >
                  <LogOut className="size-4" /> Lock Hub
                </Button>
              </SheetContent>
            </Sheet>
            <span className="section-title text-lg lg:hidden">{creatorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <GlobalSearch />
            <QuickAdd label="Quick Add" />
          </div>
        </header>
        <main className="animate-page mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
