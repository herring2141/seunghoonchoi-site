---
title: "llm-office-qa — AI 산출물 QA 오픈소스"
date: 2026-06-16
categories: ["도구"]
tags: ["오픈소스", "ai"]
subtitle: "모델의 상방은 막지 않고, 명백한 실수만 잡는다"
description: "AI가 만든 PowerPoint·Excel·Word의 객관적 결함만 잡는 오픈소스 파이썬 린터. 더 유능한 모델의 스타일 상방은 절대 건드리지 않는다. MIT 라이선스."
image: /images/llm-office-qa-card.svg
---
<div class="appcard">
  <img class="appcard__icon" src="/images/llm-office-qa-card.svg" alt="llm-office-qa 아이콘">
  <div class="appcard__body">
    <span class="appcard__free">무료 · 오픈소스(MIT)</span>
    <h3>llm-office-qa</h3>
    <p>AI가 만든 PowerPoint·Excel·Word의 명백한 실수만 잡고, 스타일은 일부러 건드리지 않는 결정론적 린터.</p>
    <a class="cta" href="https://github.com/seunghoonchoi-phd/llm-office-qa" target="_blank" rel="noopener">GitHub에서 보기 →</a>
  </div>
</div>

LLM이 슬라이드나 스프레드시트를 만들면 특정한 종류의 실수를 합니다. 슬라이드 밖으로 튀어나간 텍스트, `#REF!` 오류, 텍스트로 저장된 숫자, Word에 새어 들어간 마크다운. **llm-office-qa**는 그런 것들만 잡습니다 — 그 외에는 아무것도.

- **객관적 결함만** — 캔버스 밖 텍스트, 깨진 수식, 칸 수 안 맞는 표, 왜곡된 이미지, 일부만 남은 테두리, 잔존 마크다운
- **취향은 강제하지 않음** — 밀도·팔레트·폰트 선택·문장 품질은 모델의 몫이지 린터의 일이 아님
- **결정론적** — 파일을 읽어 측정할 뿐, 네트워크도 모델 호출도 없음
- **MIT 라이선스**, 그리고 [Claude Code](https://docs.claude.com/en/docs/claude-code) 훅으로 동작 — 납품 전에 결함을 모델에게 되먹여 고치게 함

[GitHub에서 보기 →](https://github.com/seunghoonchoi-phd/llm-office-qa)

이걸 만든 생각 — QA 레이어가 왜 더 똑똑한 모델의 족쇄가 되면 안 되는지 → [모델을 거세하지 마라](/ko/column/dont-lobotomize-the-model/)
