# sc-admin-api — Google 원클릭 편집 백엔드 (Cloudflare Worker)

`seunghoonchoi.com/admin/` 가 **구글 로그인 한 번**으로 글을 저장할 수 있게 해주는 작은 무료 백엔드.
GitHub 토큰을 **브라우저가 아니라 이 Worker가 비밀로** 쥐고, 구글 ID 토큰(본인 이메일만)을 검증한 뒤 GitHub에 대신 커밋한다.

```
[브라우저] --구글 ID토큰--> [Worker] --검증 OK--> [GitHub Contents API] (서버에 둔 GITHUB_TOKEN 사용)
```

## ★ 이미 배포돼 있다면 — 30일 자동로그인 업데이트 (지금 할 것)

편집/검수 누를 때 1시간마다 뜨던 로그인을 **30일에 한 번**으로 줄이는 변경. 두 단계:

1. **코드 갱신** — Cloudflare 대시보드 → 그 Worker → **Edit code** → 기존 코드 전부 지우고 이 폴더의 `sc-admin-api.js` 내용을 통째로 붙여넣기 → **Deploy**.
   (또는 CLI: `wrangler deploy worker/sc-admin-api.js --name sc-admin-api`)
2. **시크릿 1개 추가** — 그 Worker → **Settings → Variables and Secrets** → **Secret** `SESSION_SECRET` = 아무 긴 랜덤 문자열(32자 이상, 비밀번호 생성기 추천).
   (또는 CLI: `wrangler secret put SESSION_SECRET`)

끝. 다음 로그인부터 30일짜리 세션 토큰이 발급돼, 그 기간엔 로그인 창이 안 뜬다.
*(SESSION_SECRET을 안 넣어도 깨지진 않음 — 기존처럼 1시간 구글 토큰으로 자동 폴백.)*

## 1회 배포 (약 10분)

### A. 준비물 두 개
1. **GitHub fine-grained PAT** — github.com → Settings → Developer settings → Fine-grained tokens →
   Repository access = `seunghoonchoi-phd/seunghoonchoi-site` 만 → Permissions의 **Contents = Read and write** → 생성·복사.
2. **Google OAuth 클라이언트 ID** — [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials) →
   (동의 화면 External, 테스트 사용자에 herring2141@gmail.com 추가) →
   사용자 인증 정보 만들기 → **OAuth 클라이언트 ID → 웹 애플리케이션** →
   **승인된 자바스크립트 원본**에 `https://seunghoonchoi.com` (+ 로컬 테스트용 `http://localhost:1319`) →
   생성·`...apps.googleusercontent.com` 복사.

### B. Worker 만들기 (대시보드 방식 — 제일 쉬움)
1. [dash.cloudflare.com](https://dash.cloudflare.com) 가입/로그인 (무료) → **Workers & Pages → Create → Create Worker**.
2. 이름 예: `sc-admin-api` → Deploy → **Edit code** → 기본 코드를 지우고 `sc-admin-api.js` 내용을 통째로 붙여넣기 → **Deploy**.
3. 그 Worker의 **Settings → Variables and Secrets** 에서 **Secret** 추가:
   - `GITHUB_TOKEN` = (위 A-1 의 PAT)
   - `GOOGLE_CLIENT_ID` = (위 A-2 의 클라이언트 ID)
   - `SESSION_SECRET` = 아무 긴 랜덤 문자열(32자 이상) — 30일 자동로그인 세션 토큰 서명용
   - `ALLOWED_EMAIL` = `herring2141@gmail.com`  *(선택 — 안 넣으면 기본값 동일)*
4. 배포된 주소를 복사 (예: `https://sc-admin-api.<당신서브도메인>.workers.dev`).

### C. 관리자 페이지에 연결 (1회)
`seunghoonchoi.com/admin/` 접속 → 설정 화면에 **Worker 주소**와 **구글 클라이언트 ID** 붙여넣고 저장.
→ 이후로는 **"Google로 로그인" 한 번**이면 편집 화면. (토큰 입력 영구히 없음)

## (대안) wrangler CLI 로 배포
```bash
npm i -g wrangler
wrangler login
wrangler deploy worker/sc-admin-api.js --name sc-admin-api
wrangler secret put GITHUB_TOKEN      # 붙여넣기
wrangler secret put GOOGLE_CLIENT_ID  # 붙여넣기
wrangler secret put SESSION_SECRET    # 아무 긴 랜덤 문자열(32자+) — 30일 세션 서명용
wrangler secret put ALLOWED_EMAIL     # herring2141@gmail.com
```

## 보안 메모
- GitHub 토큰은 Worker Secret에만 있고 브라우저로 내려오지 않는다.
- Worker는 `aud`(클라이언트 ID), `email`==허용 이메일 + `email_verified`, 만료를 검증한다(구글 tokeninfo).
- 30일 **세션 토큰**은 `SESSION_SECRET`으로 HMAC-SHA256 서명한 JWT — Worker가 외부 호출 없이 직접 검증(허용 이메일·만료). `SESSION_SECRET`을 바꾸면 발급된 모든 세션이 즉시 무효(폐기).
- CORS 는 `seunghoonchoi.com`(+localhost 테스트)만 허용. 다른 출처에서 호출 불가.
- 토큰 폐기/회전은 GitHub·Cloudflare 대시보드에서 즉시 가능.
