---
title: "AI QA Tools Ruin Good Work. Don't Lobotomize the Model"
seoTitle: "Why AI PowerPoint and Excel QA Tools Wreck Your Output"
date: 2026-06-16
categories: ["AI"]
tags: ["ai", "tools", "LLM"]
subtitle: "Catch the mistakes. Leave the taste alone."
description: "QA tools for AI-generated PowerPoint, Excel, and Word force their own style and wreck the result. The open-source llm-office-qa catches only objective errors."
---

![A magnifying glass beside a laptop](/images/col-qa.jpg)

Text was spilling off the edge of the slide. I was one click from sending it.

There was more. My own Excel edits had quietly snapped back to an old version the model made an hour earlier. The table had borders on three cells out of five. That isn't taste. It's just wrong. I needed something to catch this before I hit send.

So I installed the AI QA tools that already exist.

## They skip the mistakes and force a format

Almost all of them did things I never asked for. Only this many fonts. Only this much text on one slide. Color only inside this set. No more than six bullets.

They weren't catching mistakes. They forced their own format on me and called it "quality."

## The smarter the model, the more the checker cuts it down

Here's the problem. One day a better model arrives. A model that breaks all those rules on purpose and still builds a dense, genuinely great slide.

Then that checker punishes the model for doing better.

A rule about taste becomes a shackle on the next model. It locks your output to that one moment, to the level of the weak model the rule was written for.

## This tool catches only clear mistakes

It removes only the clear mistakes. It steps out of the way for everything else.

So I gave every check two tests it has to pass.

**First. Is it objectively wrong, no matter your taste?** Text that runs off the canvas is wrong. A `#REF!` error is wrong. A table where rows have different numbers of cells is wrong. There's no room for taste here.

**Second. Would a more capable model always avoid it too?** If a smarter model might break the rule on purpose to do better work, that rule doesn't get into this tool. Not as an error, not even as a warning.

Density, color, font count, margins, prose quality. All of it fails the second test. So none of it went in.

That isn't a mistake. It's the ceiling. Raising the ceiling was never the checker's job in the first place.

## The model gives orders it can't see, and never checks

One idea sits under all of this.

Every defect comes from the same place. The model gives orders for something it can't see: the rendered slide, the real shape of a cell. It fills in a guess instead of the truth, and never checks the result.

The fix isn't a style rule. *Read the truth before you write, and verify after you write.*

A smarter model does this better. That's the whole point. The discipline doesn't fight the model. It grows with the model.

## I put it on GitHub for free

I put it on GitHub under an MIT license.

If you build things with LLMs, I'd love to know which of my checks are secretly about taste. Those are exactly the ones that shouldn't be in here.

→ [llm-office-qa on GitHub](https://github.com/seunghoonchoi-phd/llm-office-qa)
