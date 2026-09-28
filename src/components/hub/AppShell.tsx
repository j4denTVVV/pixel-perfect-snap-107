import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Home,
  Lightbulb,
  LogOut,
  Menu,
  Plus,
  Radio,
  Search,
  Settings as SettingsIcon,
  Target,
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
  { to: "/dashboard", label: "Overview", icon: Home },
  { to: "/youtube", label: "YouTube Planner", icon: Video },
  { to: "/streams", label: "Stream Planner", icon: Radio },
  { to: "/ideas", label: "Ideas", icon: Lightbulb },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to || pathname.startsWith(`${to}/`);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <Icon className={`size-4 ${active ? "text-primary" : ""}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand({ name }: { name: string }) {
  return (
    <div className="px-3 py-5">
      <p className="section-title text-shine text-lg">{name}</p>
      <p className="text-xs text-muted-foreground">Creator Hub</p>
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
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const creatorName = settings?.creator_name ?? "J4denTV";

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-3 py-2 backdrop-blur-xl lg:flex">
        <Brand name={creatorName} />
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <Button variant="ghost" className="justify-start text-muted-foreground" onClick={signOut}>
          <LogOut className="size-4" /> Sign out
        </Button>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/60 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar p-3">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Brand name={creatorName} />
                <NavLinks />
                <Button
                  variant="ghost"
                  className="mt-4 w-full justify-start text-muted-foreground"
                  onClick={signOut}
                >
                  <LogOut className="size-4" /> Sign out
                </Button>
              </SheetContent>
            </Sheet>
            <span className="section-title text-sm lg:hidden">{creatorName}</span>
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
