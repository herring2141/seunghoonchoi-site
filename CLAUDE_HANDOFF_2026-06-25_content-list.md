# Claude handoff: dashboard-style content list

Date: 2026-06-25

## User request

The user wanted the content list on seunghoonchoi.com changed from the large two-column card layout to a compact dashboard-like list, similar to the local life-dashboard screenshot. The user also asked to push the change and leave this handoff for Claude.

## What changed

- Added `layouts/partials/post-list-row.html`.
- Updated `layouts/_default/list.html` so section list pages use the new row partial instead of `post-card.html`.
- Added section-list-only CSS in `assets/css/main.css` under `Dashboard-like content rows`.
- The home page cards still use `post-card.html` and should remain card-shaped.

## Design intent

- Match the dashboard feel: row number, compact thumbnail, title, explanatory sentence, metadata pills, and tags.
- The old `read_more` button was removed because the title and thumbnail already link to the article.
- Section rows are intentionally taller than the local dashboard list so the website can show the article subtitle/summary naturally.
- On mobile, the thumbnail sits above the text column so Korean titles and explanatory sentences have enough width.
- Keep public UI honest: no fake star/check/delete controls were added.
- Preserve existing admin behavior:
  - Rows still have the `card` class so category filtering keeps working.
  - Rows still have `data-rk`.
  - Rows still contain `.card__meta` and `.card__title`, so `static/admin/edit.js` can add review badges and hide controls for the owner.

## Files touched

- `layouts/partials/post-list-row.html`
- `layouts/_default/list.html`
- `assets/css/main.css`
- `CLAUDE_HANDOFF_2026-06-25_content-list.md`

## Verification to run

```powershell
$dest='C:\Users\Public\site-build-check'
if (Test-Path $dest) { Remove-Item -Path $dest -Recurse -Force }
hugo --destination $dest --noBuildLock
```

Then open the local site and check:

- Korean column list: `/ko/column/`
- English column list: `/column/`
- Mobile width around 390 px
- Desktop width around 1200 px

This pass was verified with a temp Hugo build and screenshots:

- `C:\Users\Public\site-check-shots\column-desktop.png`
- `C:\Users\Public\site-check-shots\column-mobile-390.png`

The repo was already dirty before this task with many content changes and deleted app pages. Do not revert or stage those unrelated files unless the user explicitly asks.
