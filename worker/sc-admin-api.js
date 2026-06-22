/**
 * sc-admin-api — Cloudflare Worker
 * Backend for seunghoonchoi.com (/admin/ and the in-page inline editor):
 * authenticates the owner, then proxies GitHub Contents API calls using a GitHub
 * token held as a Worker SECRET. The browser never sees the GitHub token.
 *
 * AUTH (two ways, either is accepted on data routes):
 *   1. Google ID token (short-lived, ~1h) — verified via Google tokeninfo.
 *   2. A 30-day SESSION token (HS256 JWT signed by this Worker) — verified locally,
 *      no external call. Get one by POSTing a Google ID token to /session.
 *   This lets the editor stay logged in for ~30 days instead of re-prompting hourly.
 *
 * Secrets to set (Cloudflare dashboard → Settings → Variables, or `wrangler secret put`):
 *   GITHUB_TOKEN     - fine-grained PAT, repo seunghoonchoi-phd/seunghoonchoi-site, Contents: Read and write
 *   GOOGLE_CLIENT_ID - your OAuth client id (xxxx.apps.googleusercontent.com)
 *   SESSION_SECRET   - any long random string; signs the 30-day session tokens (REQUIRED for /session)
 *   ALLOWED_EMAIL    - (optional) defaults to herring2141@gmail.com
 *
 * Routes:
 *   POST   /session              -> {session, exp}   (needs a Google ID token; issues 30-day session)
 *   GET    /tree                 -> repo git tree (recursive)
 *   GET    /file?path=<p>        -> file contents (base64)
 *   PUT    /file?path=<p>        -> {content(base64), sha, message}  commit/update
 *   DELETE /file?path=<p>        -> {sha, message}                   delete
 */

const OWNER = 'seunghoonchoi-phd', REPO = 'seunghoonchoi-site', BRANCH = 'main';
const ALLOW_ORIGINS = ['https://seunghoonchoi.com', 'http://localhost:1319', 'http://localhost:1318', 'http://localhost:1314'];
const SESSION_TTL = 30 * 24 * 3600; // 30 days

function corsHeaders(origin) {
  const o = ALLOW_ORIGINS.includes(origin) ? origin : ALLOW_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'GET,PUT,DELETE,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}
function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

/* ---- base64url + HMAC-SHA256 session tokens (JWT-ish, self-verifying) ---- */
function b64urlFromBytes(bytes) {
  let s = ''; const a = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlFromStr(str) { return b64urlFromBytes(new TextEncoder().encode(str)); }
function strFromB64url(b64u) {
  const b64 = b64u.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
async function hmacKey(secret) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
async function signSession(payload, secret) {
  const head = b64urlFromStr(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64urlFromStr(JSON.stringify(payload));
  const data = head + '.' + body;
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return data + '.' + b64urlFromBytes(sig);
}
async function verifySession(jwt, secret) {
  try {
    const parts = (jwt || '').split('.');
    if (parts.length !== 3) return null;
    const data = parts[0] + '.' + parts[1];
    const key = await hmacKey(secret);
    const sig = Uint8Array.from(atob(parts[2].replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const ok = await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(data));
    if (!ok) return null;
    return JSON.parse(strFromB64url(parts[1])); // {email, iat, exp}
  } catch (e) { return null; }
}

/* ---- Google ID token verification ---- */
async function verifyGoogle(idToken, env) {
  if (!idToken) return { ok: false, status: 401, error: 'missing token' };
  let info = null;
  try {
    const ti = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken));
    if (ti.ok) info = await ti.json();
  } catch (e) { /* info stays null */ }
  if (!info) return { ok: false, status: 401, error: 'invalid Google token' };
  const allowedEmail = (env.ALLOWED_EMAIL || 'herring2141@gmail.com').toLowerCase();
  if (info.aud !== env.GOOGLE_CLIENT_ID) return { ok: false, status: 403, error: 'wrong audience' };
  if ((info.email || '').toLowerCase() !== allowedEmail || String(info.email_verified) !== 'true')
    return { ok: false, status: 403, error: 'forbidden: ' + (info.email || '?') };
  if (!(parseInt(info.exp, 10) * 1000 > Date.now())) return { ok: false, status: 401, error: 'token expired' };
  return { ok: true, email: allowedEmail };
}

export default {
  async fetch(request, env) {
    const ch = corsHeaders(request.headers.get('Origin') || '');
    if (request.method === 'OPTIONS') return new Response(null, { headers: ch });

    const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
    const url = new URL(request.url);
    const seg = url.pathname.replace(/^\/+|\/+$/g, '');
    const allowedEmail = (env.ALLOWED_EMAIL || 'herring2141@gmail.com').toLowerCase();

    // ---- /session : exchange a Google ID token for a 30-day session token ----
    if (seg === 'session' && request.method === 'POST') {
      const g = await verifyGoogle(token, env);
      if (!g.ok) return json({ error: g.error }, g.status, ch);
      if (!env.SESSION_SECRET) return json({ error: 'SESSION_SECRET not set on the Worker' }, 500, ch);
      const now = Math.floor(Date.now() / 1000);
      const exp = now + SESSION_TTL;
      const session = await signSession({ email: g.email, iat: now, exp }, env.SESSION_SECRET);
      return json({ session, exp }, 200, ch);
    }

    // ---- auth for data routes: accept a session token OR a Google ID token ----
    let authed = false;
    if (env.SESSION_SECRET) {
      const s = await verifySession(token, env.SESSION_SECRET);
      if (s && (s.email || '').toLowerCase() === allowedEmail && s.exp * 1000 > Date.now()) authed = true;
    }
    if (!authed) {
      const g = await verifyGoogle(token, env);
      if (!g.ok) return json({ error: g.error }, g.status, ch);
    }

    // ---- proxy to GitHub using the server-held token ----
    const path = url.searchParams.get('path') || '';
    const API = `https://api.github.com/repos/${OWNER}/${REPO}`;
    const gh = {
      'Authorization': 'Bearer ' + env.GITHUB_TOKEN,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'sc-admin-worker',
    };

    let r;
    try {
      if (seg === 'tree' && request.method === 'GET') {
        r = await fetch(`${API}/git/trees/${BRANCH}?recursive=1`, { headers: gh });
      } else if (seg === 'file' && request.method === 'GET') {
        if (!path) return json({ error: 'no path' }, 400, ch);
        r = await fetch(`${API}/contents/${encodeURI(path)}?ref=${BRANCH}`, { headers: gh });
      } else if (seg === 'file' && request.method === 'PUT') {
        if (!path) return json({ error: 'no path' }, 400, ch);
        const b = await request.json();
        r = await fetch(`${API}/contents/${encodeURI(path)}`, {
          method: 'PUT', headers: { ...gh, 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: b.message || ('admin: edit ' + path), content: b.content, sha: b.sha, branch: BRANCH }),
        });
      } else if (seg === 'file' && request.method === 'DELETE') {
        if (!path) return json({ error: 'no path' }, 400, ch);
        const b = await request.json();
        r = await fetch(`${API}/contents/${encodeURI(path)}`, {
          method: 'DELETE', headers: { ...gh, 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: b.message || ('admin: delete ' + path), sha: b.sha, branch: BRANCH }),
        });
      } else {
        return json({ error: 'not found' }, 404, ch);
      }
    } catch (e) {
      return json({ error: 'github proxy error: ' + e.message }, 502, ch);
    }

    const text = await r.text();
    return new Response(text, { status: r.status, headers: { ...ch, 'Content-Type': 'application/json' } });
  },
};
