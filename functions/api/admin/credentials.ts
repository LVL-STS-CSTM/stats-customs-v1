
interface Env {
  STATSCUSTOMSDATA: any;
}

const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Type': 'application/json'
};

const getAuthToken = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

const isAuthenticated = async (token: string | null, env: Env) => {
  if (!token) return false;
  const storedCredsRaw = await env.STATSCUSTOMSDATA.get('credential');
  if (!storedCredsRaw) return false;
  const storedCreds = JSON.parse(storedCredsRaw);
  const expectedToken = `${storedCreds.username}:${storedCreds.password}`;
  return token === expectedToken;
};

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  const { env, request } = context;
  const token = getAuthToken(request);

  if (!(await isAuthenticated(token, env))) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { 
        status: 401,
        headers: SECURITY_HEADERS
    });
  }

  try {
    const { username, password } = await request.json() as any;

    if (!username || !password || password.length < 8) {
      return new Response(JSON.stringify({ message: 'Invalid payload constraints.' }), { 
        status: 400,
        headers: SECURITY_HEADERS
      });
    }

    // Persist new credentials to KV
    await env.STATSCUSTOMSDATA.put('credential', JSON.stringify({ username, password }));
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: SECURITY_HEADERS,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ message: 'Internal update failure' }), {
      status: 500,
      headers: SECURITY_HEADERS,
    });
  }
};
