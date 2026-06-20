/**
 * sc-admin-api — Cloudflare Worker
 * Backend for seunghoonchoi.com/admin/ : verifies a Google ID token (only the
 * allowed account), then proxies GitHub Contents API calls using a GitHub token
 * held as a Worker SECRET. The browser never sees the GitHub token.
 *
 * Secrets to set (Cloudflare dashboard → Settings → Variables, or `wrangler secret put`):
 *   GITHUB_TOKEN     - fine-grained PAT, repo seunghoonchoi-phd/seunghoonchoi-site, Contents: Read and write
 *   GOOGLE_CLIENT_ID - your OAuth client id (xxxx.apps.googleusercontent.com)
 *   ALLOWED_EMAIL    - (optional) defaults to herring2141@gmail.com
 *
 * Routes (all require  Authorization: Bearer <google-id-token> ):
 *   GET    /tree                 -> repo git tree (recursive)
 *   GET    /file?path=<p>        -> file contents (base64)
 *   PUT    /file?path=<p>        -> {content(base64), sha, message}  commit/update
 *   DELETE /file?path=<p>        -> {sha, message}                   delete
 */

const OWNER = 'seunghoonchoi-phd', REPO = 'seunghoonchoi-site', BRANCH = 'main';
const ALLOW_ORIGINS = ['https://seunghoonchoi.com', 'http://localhost:1319', 'http://localhost:1318'];

function corsHeaders(origin) {
  const o = ALLOW_ORIGINS.includes(origin) ? origin : ALLOW_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}
function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

export default {
  async fetch(request, env) {
    const ch = corsHeaders(request.headers.get('Origin') || '');
    if (request.method === 'OPTIONS') return new Response(null, { headers: ch });

    // ---- 1) verify the Google ID token (Google validates signature/issuer for us) ----
    const idToken = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
    if (!idToken) return json({ error: 'missing Google token' }, 401, ch);

    let info = null;
    try {
      const ti = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken));
      if (ti.ok) info = await ti.json();
    } catch (e) { /* info stays null */ }
    if (!info) return json({ error: 'invalid Google token' }, 401, ch);

    const allowedEmail = (env.ALLOWED_EMAIL || 'herring2141@gmail.com').toLowerCase();
    if (info.aud !== env.GOOGLE_CLIENT_ID) return json({ error: 'wrong audience' }, 403, ch);
    if ((info.email || '').toLowerCase() !== allowedEmail || String(info.email_verified) !== 'true')
      return json({ error: 'forbidden: ' + (info.email || '?') }, 403, ch);
    if (!(parseInt(info.exp, 10) * 1000 > Date.now())) return json({ error: 'token expired' }, 401, ch);

    // ---- 2) proxy to GitHub using the server-held token ----
    const url = new URL(request.url);
    const seg = url.pathname.replace(/^\/+|\/+$/g, '');
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
