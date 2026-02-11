
interface Env {
  STATSCUSTOMSDATA: any;
  ADMIN_SECRET: string;
}

const SECURITY_HEADERS = {
  'Content-Type': 'application/json'
};

async function checkLoginRateLimit(ip: string, env: Env) {
  if (!env.STATSCUSTOMSDATA) return true;
  const key = `rl_login_fail_${ip}`;
  const count = await env.STATSCUSTOMSDATA.get(key);
  if (count && parseInt(count) >= 5) return false;
  return true;
}

async function recordLoginFailure(ip: string, env: Env) {
  if (!env.STATSCUSTOMSDATA) return;
  const key = `rl_login_fail_${ip}`;
  const count = await env.STATSCUSTOMSDATA.get(key);
  const newCount = (count ? parseInt(count) : 0) + 1;
  await env.STATSCUSTOMSDATA.put(key, newCount.toString(), { expirationTtl: 900 }); // 15 min lock
}

async function clearLoginFailures(ip: string, env: Env) {
  if (env.STATSCUSTOMSDATA) await env.STATSCUSTOMSDATA.delete(`rl_login_fail_${ip}`);
}

async function signToken(payload: any, secret: string) {
  const encoder = new TextEncoder();
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const data = btoa(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) }));
  const message = `${header}.${data}`;
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return `${message}.${signatureBase64}`;
}

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';
  
  if (!(await checkLoginRateLimit(ip, context.env))) {
    return new Response(JSON.stringify({ message: 'Too many attempts. Access locked for 15 minutes.' }), { status: 429, headers: SECURITY_HEADERS });
  }

  try {
    const { username, password } = await context.request.json() as any;
    const storedCredsRaw = await context.env.STATSCUSTOMSDATA.get('credential');
    
    if (!storedCredsRaw) return new Response('Initialization Pending', { status: 500, headers: SECURITY_HEADERS });

    const storedCreds = JSON.parse(storedCredsRaw);
    const secret = context.env.ADMIN_SECRET || "fallback_internal_secret_level_customs";

    if (username === storedCreds.username && password === storedCreds.password) {
      await clearLoginFailures(ip, context.env);
      const token = await signToken({ user: username }, secret);
      return new Response(JSON.stringify({ success: true, token }), { status: 200, headers: SECURITY_HEADERS });
    }
    
    await recordLoginFailure(ip, context.env);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return new Response(JSON.stringify({ success: false, message: 'Invalid credentials' }), { status: 401, headers: SECURITY_HEADERS });
  } catch {
    return new Response('Protocol Error', { status: 400, headers: SECURITY_HEADERS });
  }
};
