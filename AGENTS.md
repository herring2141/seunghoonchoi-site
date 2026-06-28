# Homepage Work Rules

Follow the global user instructions first. These rules apply to this website repository.

## Incomplete Drafts

- When the user asks to put a homepage article, draft, or rough idea into `미완료`, create it under `content/<lang>/incomplete/`.
- Treat `미완료` as the owner's private draft shelf. Write the draft seriously and completely, but do not ask for a pre-publication review before committing.
- Use front matter with `hidden: true` and `reviewStatus: "none"` unless the user explicitly says otherwise.
- Fill the draft-list fields so the admin queue stays scannable when many drafts pile up: `title`, `date`, `draftSource` or `categories`, `subtitle`, `tags`, and `image` when a relevant existing image is available.
- After creating or updating a `미완료` draft, run the relevant Hugo build check, commit the scoped change, and push to `origin/main`.
- Do not move a `미완료` draft into a public section such as `column`, `career`, `apps`, `research`, `books`, or `literature` unless the user explicitly asks.

## Article Publish Harness

- For article-only changes under `content/<lang>/...`, use `tools/publish-article.ps1` instead of a manual full-site check.
- Default preflight command:
  `powershell -ExecutionPolicy Bypass -File tools\publish-article.ps1 -ContentPath content\ko\column\example.md`
- Default publish command:
  `powershell -ExecutionPolicy Bypass -File tools\publish-article.ps1 -ContentPath content\ko\column\example.md -Push -CommitMessage "Publish article: <short title>"`
- The harness checks front matter, public `draft: true`, Korean em/en dashes, leftover TODO/FIXME markers, conditional RTL risk, Hugo local server rendering, a Chrome screenshot, scoped commit/push, and live page propagation.
- Use `-SkipScreenshot` only for a text-only smoke check. Use `-FullBuild` when the change touches layout, CSS, Hugo config, static assets, images that affect layout, Arabic pages, or anything outside a single article body/front matter.
- For Claude/Codex coordination, Claude should focus on read-only content and risk review: argument shape, Korean tone, source claims, expected URL/title, and whether `-FullBuild` is needed. Codex should run the deterministic pipeline: edit files, execute the harness, inspect screenshots, commit, push, and verify live output.

## RTL Layout Guard

- Arabic pages are RTL, but math/formula notation is LTR. Keep `.formula-block` content `direction:ltr` and visually centered.
- Do not center article-wide blocks with physical `margin-left:50%` plus `translateX(-50%)` unless an `html[dir="rtl"]` mirror rule is present. In RTL, mirror that centering with `margin-right:50%`, `margin-left:0`, and `translateX(50%)`.
- Do not hide skip links or screen-reader helpers with `left:-9999px`; in RTL pages that creates huge horizontal overflow. Use clipping (`clip-path:inset(50%)`) instead.
- After changing CSS, layout templates, Hugo language direction config, or Arabic content that contains wide blocks, run `node tools/check-rtl-layout.cjs` and `hugo --minify`.
- For visual changes touching Arabic pages, render and inspect `/ar/column/questions-lifeline/` or the affected Arabic page before publishing.
