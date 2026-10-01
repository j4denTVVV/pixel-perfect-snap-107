# Finish and restyle the Creator Hub

## Changes
- Add Calendar, Challenges, Marathons, Subathons, Collabs, IRLs, Overlays, and Equipment to the desktop and mobile side menus, grouped for quick scanning.
- Restyle only the private Creator Hub with the public page’s black, warm-gold, cream, and condensed editorial typography while preserving useful status colors.
- Refine the shell, buttons, cards, forms, dialogs, filters, calendar, and page headings so every existing Hub tool shares the same premium visual system.
- Keep all current planning, editing, deletion, checklist, search, and saved-data behavior unchanged.

## Verification
- Confirm the latest build completes without errors.
- Open every private page in an authenticated fresh browser session and verify it renders, navigates, and exposes its main add/edit controls.
- Check desktop and mobile navigation, and correct any visual overlap or runtime errors found.

## Technical details
- Reuse the existing TanStack routes and shared components; no new account, data, or backend changes.
- Extend semantic theme tokens in the global styles and use the existing shared Button controls.
- Preserve the password gate and lock-session behavior.
