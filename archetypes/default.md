---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: false
categories: []
tags: []            # ≤5, reused across ko/en/zh (entity consistency)
subtitle: ""         # one-line hook shown under the title
description: ""      # ≤155 chars, the answer in one line (this is the AI/SEO snippet). Leave blank → auto from first paragraph
seoTitle: ""         # keyword-first + hook. Leave blank → uses title
# faq: the real questions a reader would type — each becomes a FAQPage schema Q&A (AI engines lift these verbatim)
# faq:
#   - q: "A question a reader would search for?"
#     a: "A self-contained 2–3 sentence answer. Include a concrete number or source where possible."
---

<!-- GEO writing rules (Princeton GEO study, measured visibility lift: quotations +41% · statistics +33% · cited sources +28%):
  1. First paragraph = answer-first. Directly answer the title's implied question in 2–3 sentences before anything else.
  2. Phrase H2/H3 as questions. Each section must read on its own (self-contained chunk) — RAG retrieves chunks, not whole pages.
  3. Back every claim with a concrete number + source + a direct quotation. Replace vague words ("many", "often") with figures.
  4. No keyword stuffing — it measurably backfires.
  5. Add 3+ faq entries above. Keep ko/en/zh in parity. -->
