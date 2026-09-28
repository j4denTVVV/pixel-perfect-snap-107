import { ExternalLink } from "lucide-react";

const HANDLE = "j4denTV";
export const SOCIALS = [
  { name: "Twitch", url: `https://twitch.tv/${HANDLE}` },
  { name: "YouTube", url: `https://youtube.com/@${HANDLE}` },
  { name: "TikTok", url: `https://tiktok.com/@${HANDLE}` },
  { name: "Instagram", url: `https://instagram.com/${HANDLE}` },
  { name: "X", url: `https://x.com/${HANDLE}` },
];

export function SocialsCard() {
  return (
    <section className="panel p-6">
      <p className="section-title text-lg">My socials</p>
      <p className="text-sm text-muted-foreground">@{HANDLE} everywhere</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {SOCIALS.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="panel-hover flex items-center justify-between rounded-lg border border-border px-4 py-3"
          >
            <span>
              <span className="block text-sm font-medium">{s.name}</span>
              <span className="block text-xs text-muted-foreground">@{HANDLE}</span>
            </span>
            <ExternalLink className="size-4 text-muted-foreground" />
          </a>
        ))}
      </div>
    </section>
  );
}
