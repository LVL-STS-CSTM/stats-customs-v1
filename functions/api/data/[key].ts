
interface Env {
  // Use any because KVNamespace type is not recognized in this environment
  STATSCUSTOMSDATA: any;
  ADMIN_SECRET: string;
}

const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Content-Type': 'application/json'
};

async function verifyToken(token: string, secret: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const [header, payload, signature] = parts;
    const message = `${header}.${payload}`;
    const encoder = new TextEncoder();
    
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    
    const sigArray = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    return await crypto.subtle.verify("HMAC", key, sigArray, encoder.encode(message));
  } catch {
    return false;
  }
}

const getAuthToken = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  return authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
};

export const onRequestGet = async (context: { env: Env; params: { [key: string]: string | string[] }; request: Request }) => {
  const key = context.params.key as string;
  const data = await context.env.STATSCUSTOMSDATA.get(key, 'json');

  if (data === null) {
    return new Response(JSON.stringify({ message: 'Empty Segment' }), {
      status: 404,
      headers: SECURITY_HEADERS,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...SECURITY_HEADERS, 'Cache-Control': 'public, max-age=60' },
  });
};

export const onRequestPost = async (context: { env: Env; params: { [key: string]: string | string[] }; request: Request }) => {
  const key = context.params.key as string;
  const token = getAuthToken(context.request);
  const secret = context.env.ADMIN_SECRET || "fallback_internal_secret_level_customs";

  if (!token || !(await verifyToken(token, secret))) {
    return new Response(JSON.stringify({ message: 'Token Expired or Invalid' }), { 
        status: 401,
        headers: SECURITY_HEADERS
    });
  }

  try {
    const body = await context.request.json();
    await context.env.STATSCUSTOMSDATA.put(key, JSON.stringify(body));
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: SECURITY_HEADERS });
  } catch {
    return new Response(JSON.stringify({ message: 'I/O Failure' }), { status: 500, headers: SECURITY_HEADERS });
  }
};
