# Claude Handoff: Foundations Writing Style

Date: 2026-06-28

## Scope

This guide is for Korean public copy under:

- `content/ko/foundations/**`

The `기초지식` tab is not a viral column section. Treat it as a clear knowledge map for readers who want to decide what to study next. The tone should be plain, calm, and useful, with enough personality to avoid sounding like a syllabus.

## Main Goal

Make every page sound like a person explaining why the concept matters, not like a catalog entry generated from a course outline.

Good foundations copy should do three things:

- Say what the concept helps the reader see.
- Show why it matters in the AI era.
- Stay short enough that the reader can scan the map quickly.

## Style Rules

1. Start from a concrete use, not an abstract definition.

Bad:

> 통계는 데이터에서 진짜 패턴과 우연을 가려내는 방법입니다.

Better:

> 표본이 적거나 한쪽으로 치우치면, 그럴듯한 결론도 쉽게 무너집니다. 통계는 그런 숫자를 의심하게 해 줍니다.

For very short glossary pages, it is fine to name the concept first, but the second sentence should quickly show why it matters.

2. Avoid duplicated subtitle and body wording.

Bad:

```markdown
subtitle: "사람을 움직이는 신호입니다"
---
사람을 움직이는 신호입니다.
```

Better:

```markdown
subtitle: "사람을 움직이는 신호입니다"
---
인센티브는 사람을 움직이는 신호입니다. 사람은 대체로 말보다 보상과 벌에 더 민감하게 반응합니다.
```

3. Use everyday Korean.

Prefer:

- `무엇을 먼저 할지 고른다`
- `어디서 틀렸는지 본다`
- `실제로 되는지 따진다`
- `멈추지 않게 굴린다`

Avoid stiff words unless needed:

- `유효하다`
- `구조화한다`
- `작동 기제`
- `인식론적`
- `실재성`
- `최적화된 의사결정`

If a technical word is necessary, explain it in the next sentence with plain Korean.

4. Do not overuse the `A가 아니라 B다` pattern.

This structure can be useful, but too many of them sound like AI-generated opinion writing. In foundations pages, use it rarely. Prefer normal explanation:

Bad:

> 수학은 계산이 아니라 판단입니다.

Better:

> 계산은 기계가 더 잘해도, 무엇을 계산할지 정하고 결과를 의심하는 일은 여전히 사람이 합니다.

5. Do not use em dashes or en dashes in Korean public copy.

Never use:

- `—`
- `–`

Use a period, comma, colon, or rewrite the sentence.

6. Keep each short concept page compact.

Target shape:

- front matter title/subtitle/weight
- body of 2 to 4 sentences
- no lists unless the page is being expanded into a full guide

These pages are map nodes. They should invite the reader to understand the concept, not become full lectures yet.

7. Keep index pages as readable explanations, not manifestos.

For each section index such as `math/_index.md` or `engineering/_index.md`:

- first paragraph: why this field matters now
- second paragraph: what the field trains the reader to see
- section `## AI 시대에 왜 더 중요한가`
- section `## 어디로 이어지나`

Do not turn these into dramatic columns. A small hook is fine, but this area should feel reliable.

8. Do not invent personal anecdotes.

The private style guide encourages concrete scenes, but this foundations area currently does not contain first-person stories. Do not add a fake lab scene, company story, school story, or personal anecdote unless 승훈님 supplies it.

Use generic but concrete examples instead:

- AI predicting a material property
- a model giving a confident but wrong answer
- data being biased
- a system working once but failing in daily operation
- a legal boundary around generated text, images, data, or decisions

## Patterns Used In This Pass

The latest rewrite changed the style in these directions:

- `AI 시대의 기본기, 수학...` descriptions became direct reader-facing descriptions.
- Repeated one-line definitions became two or three sentence explanations.
- Abstract category phrases became action phrases.
- Long subtitles in engineering were shortened so the cards do not read like paragraphs.
- Bold emphasis inside body copy was removed unless truly needed.
- Dense noun lists were turned into verbs.
- The main map page now says why the eight fields cover form, mind, nature, and society without using MECE jargon.

## Before And After Examples From Foundations

Before:

> AI 시대의 기본기, 수학. 흐릿한 문제를 구조와 숫자로 바꾸고, AI가 낸 답을 의심하는 힘을 정리합니다.

After:

> AI가 낸 숫자를 그대로 믿어도 되는지 보려면 수학의 언어가 필요합니다. 흐릿한 문제를 구조와 숫자로 바꾸는 법을 정리합니다.

Before:

> 무엇을 기계로 풀 수 있고, 무엇은 아무리 좋은 컴퓨터로도 못 푸는지 봅니다.

After:

> 계산은 어떤 문제를 기계로 풀 수 있는지 따지는 출발점입니다. 아무리 좋은 컴퓨터가 있어도 원리상 안 되거나 시간이 너무 오래 걸리는 일이 있습니다.

Before:

> 사람과 환경을 해치지 않도록 미리 막는 장치입니다. 잘 될 때가 아니라 잘못될 때를 기준으로 설계합니다.

After:

> 안전은 사람과 환경을 해치지 않도록 미리 막는 장치입니다. 잘 될 때만 보고 설계하면 위험을 놓칩니다. 공학은 잘못될 때를 먼저 상상하고, 그때 피해가 커지지 않게 만들어야 합니다.

## Editing Checklist

Before handing work back to Codex or 승훈님, check:

- No em dash or en dash in `content/ko/foundations/**`.
- No fake first-person anecdote.
- No repeated subtitle sentence as the first body sentence unless it is expanded immediately.
- No overlong subtitle that will make cards feel cramped.
- No unexplained hard term in the first sentence.
- Front matter keys, weights, slugs, and links are preserved.
- Hugo builds.

## Verification Commands For Codex

Codex should run the deterministic checks:

```powershell
hugo --minify
rg -n "[—–]|AI 시대의 기본기,|더 덜" content/ko/foundations
```

If layout, CSS, Arabic pages, or global templates are touched, also run:

```powershell
node tools/check-rtl-layout.cjs
```

