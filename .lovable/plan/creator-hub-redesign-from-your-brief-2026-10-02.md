# Creator Hub redesign (from your brief)

Keeps every saved item, page address and the password gate. Delivered in 3 phases so each one can be checked before the next starts.

## Phase 1 — Look, profile photo, navigation, Overview
- Use the new profile photo (gold ring, slow breathing glow) in the sidebar, Overview hero, creator card and Settings.
- New sidebar: Overview / PLAN: Live Planner, YouTube, Collabs, Ideas / RESOURCES: Assets / TRACK: Analytics, Calendar, Goals / Settings. A gold marker slides between pages. Mobile gets a bottom bar plus the drawer.
- Visual depth: faint grain, soft gold glows, three card levels (featured with a gold edge, standard, minimal), hover lift, smoother page and card entrances, numbers that count up, animated progress bars.
- Overview hero: "Welcome back, Jaden.", J4denTV, 4TV Creator HQ, "Plan it. Make it. Run it.", photo, and a NEXT UP card with countdown and an Open Plan button.
- Mixed-size tiles: Road to 1K (followers / 1,000, deadline 31 December, days left), Next Event, This Month, Improve This Week tips from your data, Quick Plan buttons.

## Phase 2 — Live Planner, Assets, smart create, YouTube, Ideas
- Live Planner page with tabs All / Streams / Challenges / Marathons / Subathons / IRLs; cards show the type with its own icon, date, status and a short detail.
- "+ Plan Live" first asks what you are planning, then shows only that type's fields (e.g. subathon timer rules and milestones, marathon games and breaks).
- Assets page with Overlays / Equipment tabs.
- Old addresses (/streams, /challenges, /overlays, etc.) redirect to the right tab.
- YouTube board shows cards with a thumbnail space and distinct status colours. Board stays the default view.
- Ideas become masonry cards with a quick-add box: type, press Enter, saved.
- Friendly small empty states everywhere, no big empty boxes.

## Phase 3 — Collabs with creator search, Analytics, Calendar
- Saved creator profiles (photo, name, @handle, linked Twitch/YouTube/TikTok/Instagram, notes, past and upcoming collabs).
- "+ Find Creator" searches your saved creators first, then searches the web for real profiles. Results show platform badges and can be linked into one creator. Fake results are never shown. If web search isn't connected, you get "Search YouTube / Twitch / TikTok / Instagram" buttons instead.
- Collab plan form with the statuses you listed. Collab cards show the creator's photo.
- Analytics: four large figures, 2–3 animated charts, week/month switch, What To Improve tips.
- Calendar shows everything, including collabs, each with its own icon, and opens the plan when clicked.

## Technical details
- Add framer-motion. New tokens and utilities in styles.css. Upload the photo with lovable-assets.
- New tables `creators` and `collabs` (user-scoped RLS + grants). Hub item fields that only apply to one type go in a jsonb `details` column on `hub_items`, so existing rows stay intact.
- Web creator search runs in a server function through the Firecrawl connector (search API). The API key stays on the server.
- Verify the build and click through every page in a fresh signed-in browser after each phase.
