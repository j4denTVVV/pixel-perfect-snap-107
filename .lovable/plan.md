# Creator Hub: black-and-white redesign + new features

This replaces the earlier gold plan. Your saved content, page addresses, the public front page and the password gate all stay as they are.

## What changes

**Look (whole Hub)**
- Gold is removed. Everything uses black, charcoal, white, off-white and silver, with subtle glass cards, white shine across headings and buttons, and soft depth. Only platform logos and very faint status colours add colour.
- Big condensed headings like the front page (WELCOME BACK, JADEN.). Larger buttons: white with black text, or dark with a white border. They lift slightly and shine on hover.
- Your profile photo has a thin silver ring and a slow white glow. It appears in the sidebar, Overview, Settings and Connected Accounts.
- Smooth motion: pages fade up, cards appear one after another, numbers count up, progress bars fill, tab markers slide, pop-ups fade and scale. No bouncing.

**Navigation**
- Overview / PLAN: Live Planner, YouTube, Collabs, Ideas / TRACK: Analytics, Calendar, Goals / RESOURCES: Creator Tools, Equipment / Settings.
- Old addresses (/streams, /challenges, /marathons, /subathons, /irl, /overlays, /assets) redirect to the right tab. On phones there's a bottom bar plus a drawer.

**Overview** (only these sections): a welcome area with your photo, PLAN CONTENT and VIEW ANALYTICS buttons, and a NEXT UP countdown. Below it: Road to 1K (deadline 31 Dec 2026, days left, a big progress bar), Live Insights with platform tabs, This Month with small up/down comparisons, What To Improve (up to 3 tips taken from your real data), Workspace shortcuts (Notion, Metricool, StreamCharts, StreamElements) and Quick Add.

**Planning**
- Live Planner tabs: All, Streams, Challenges, Marathons, Subathons, IRLs. Each card shows its type icon, title, date and time, platform logos and status.
- New 3-step create flow: (1) big buttons asking what you're planning, (2) only title, date, time, platforms and game, (3) optional extras you can open if you want them (segments, rules, goals, checklist, equipment, collab, notes, reward). You can save after step 2.
- Platform picker uses logo cards (Twitch, YouTube, TikTok, Instagram, Facebook, X). You can pick more than one, and selected cards show a white border and a tick. The same picker appears everywhere.
- Quick Add opens a grid of big buttons: Stream, Challenge, Marathon, Subathon, IRL, Collab, YouTube, Idea, Goal.
- YouTube: Board view by default, plus Calendar and List. Cards show a thumbnail, title, type, status and dates, using your status list.
- Ideas: a single "Quick idea" box at the top. Press Enter and it's saved, then you can add type, priority and tags.
- Collabs: Find Creator searches your saved creators first, then the web for real profiles with platform badges. You can link profiles that belong to the same creator. The collab plan uses your 8 statuses, and confirmed collabs go on the Calendar.

**Tracking**
- Analytics: five top figures, platform logo tabs, time filters (7 days up to this year) and at most 3 charts. Missing figures show "DATA NOT AVAILABLE".
- Goals: big visual cards showing current / target, %, days left and a "COMPLETED ✓" shine when done. You can still add your own goals.
- Calendar: Month, Week and Agenda views. Every type has its own icon, and clicking an event opens its plan.

**Resources**
- Creator Tools tabs: Overlays (StreamElements, Streamlabs), Emotes (7TV with live emote search through 7TV's public data), Analytics (StreamCharts with a link to your J4denTV page) and Streaming Tools (OBS, Metricool, Notion and more). Each one is a card with its logo, a short description and buttons that open the real site.
- Equipment: a large search bar, category buttons, and My Setup (Own / Want / Ordered / Upgrade Later) with an estimated total in GBP.

**Settings tabs:** Profile, Connected Accounts, Integrations, Appearance (animations, reduced motion, background effects, compact cards), Preferences (timezone, platform, stream length, GBP, Amazon UK) and Security (change password, Lock Hub).

**Global search** covers everything: plans, collabs, creators, videos, ideas, equipment, tools and goals.

## What I can't fully connect yet

You asked me never to fake data, so these will clearly show "Not connected" with a working button to open the real site:
- **Live channel stats** (Twitch, YouTube, TikTok, Instagram, Facebook) and **Metricool sync**: each needs its own developer account or API access. Until then, Analytics uses the figures you save in the Hub.
- **Amazon prices**: needs an Amazon Product Advertising account. Until then, "Search Amazon" opens Amazon UK with what you typed.
- **Notion**: can be connected later through the Notion connector. Until then it's a link.
- **Creator web search** needs a web search connection. If there isn't one, you get buttons that search each platform directly.

## Technical details
- Monochrome tokens replace the gold ones in styles.css (gold-ring becomes silver-ring). New shared pieces: PlatformPicker, PlanWizard, a bento layout, and an IntegrationCard with a connected/not-connected state.
- Migration: add `creators`, `collabs`, `setup_items` and `integrations` tables (user-scoped RLS plus grants). Add `platforms text[]` and `details jsonb` to `hub_items` and `streams`. Add `appearance` and `preferences` jsonb to `settings`. Nothing gets deleted.
- Creator web search and 7TV search run in server functions. A connector's key stays on the server, and the integration state is read from the real connection.
- After building: check the build, then click through every page in a fresh signed-in browser (desktop and mobile), including the gate, Lock Hub and redirects. Finish with the COMPLETED / CONNECTED / NEEDS CONNECTION / FIXED report.
