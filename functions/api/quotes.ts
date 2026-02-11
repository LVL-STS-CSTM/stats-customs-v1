interface Env {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_SHEET_ID: string;
  STATSCUSTOMSDATA: any;
  ADMIN_SECRET: string;
}

const SECURITY_HEADERS = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
};

async function verifyToken(token: string, secret: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [header, payload, signature] = parts;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sigArray = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    return await crypto.subtle.verify("HMAC", key, sigArray, encoder.encode(`${header}.${payload}`));
  } catch { return false; }
}

async function checkRateLimit(ip: string, type: string, limit: number, windowSeconds: number, env: Env) {
  if (!env.STATSCUSTOMSDATA) return true;
  const key = `rl_${type}_${ip}`;
  const count = await env.STATSCUSTOMSDATA.get(key);
  const currentCount = count ? parseInt(count) : 0;
  if (currentCount >= limit) return false;
  await env.STATSCUSTOMSDATA.put(key, (currentCount + 1).toString(), { expirationTtl: windowSeconds });
  return true;
}

async function signJwt(email: string, privateKey: string, scope: string) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = { iss: email, scope: scope, aud: 'https://oauth2.googleapis.com/token', exp: now + 3600, iat: now };
  
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedClaim = btoa(JSON.stringify(claim)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const message = `${encodedHeader}.${encodedClaim}`;
  
  // Clean PEM: Handle escaped newlines from dashboard and remove headers/footers
  const pemContents = privateKey
    .replace(/\\n/g, '\n')
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');
    
  try {
    const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
    const key = await crypto.subtle.importKey(
      "pkcs8", 
      binaryKey.buffer, 
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, 
      false, 
      ["sign"]
    );
    const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(message));
    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    return `${message}.${encodedSignature}`;
  } catch (e) {
    throw new Error(`JWT_SIGNING_FAILURE: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}

async function getAccessToken(env: Env) {
  if (!env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_PRIVATE_KEY) throw new Error("CREDENTIALS_MISSING");
  const jwt = await signJwt(env.GOOGLE_SERVICE_ACCOUNT_EMAIL, env.GOOGLE_PRIVATE_KEY, 'https://www.googleapis.com/auth/spreadsheets');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });
  if (!res.ok) {
      const err = await res.text();
      throw new Error(`OAUTH_TOKEN_REJECTED: ${err}`);
  }
  const data: any = await res.json();
  return data.access_token;
}

export const onRequestPost = async (context: { env: Env; request: Request }) => {
  const { env, request } = context;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  try {
    if (!(await checkRateLimit(ip, 'quotes', 20, 3600, env))) {
        return new Response(JSON.stringify({ message: 'Rate limit exceeded. Please try again later.' }), { status: 429, headers: SECURITY_HEADERS });
    }

    const body = await request.json() as any;
    const { contact, items, type } = body;

    const quoteId = type === 'direct_order' ? `ORD-${Date.now()}` : `QT-${Date.now()}`;
    const timestamp = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' });

    let aggregateTotal = 0;
    let aggregateQty = 0;
    const itemNames: string[] = [];
    const colorNames: string[] = [];
    
    items.forEach((item: any) => {
        let itemQty = 0;
        Object.values(item.sizeQuantities).forEach((q) => itemQty += Number(q));
        if (itemQty > 0) {
            aggregateTotal += (item.unitPrice * itemQty);
            aggregateQty += itemQty;
            itemNames.push(`${item.product.name} (x${itemQty})`);
            colorNames.push(item.selectedColor.name);
        }
    });

    const token = await getAccessToken(env);
    const sheetBody = {
        values: [[ 
            quoteId, timestamp, 'New', contact.name, contact.email, 
            contact.phone || '', contact.company || 'N/A', contact.message || '', 
            itemNames.join(' | '), colorNames.join(' | '), aggregateQty, aggregateTotal,
            body.logoData ? 'Base64 Attached' : 'None',
            body.designData ? 'Base64 Attached' : 'None'
        ]]
    };
    
    const sheetRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values/Quotes!A1:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(sheetBody)
    });

    if (!sheetRes.ok) throw new Error(`SHEETS_API_UNAVAILABLE`);

    return new Response(JSON.stringify({ success: true, id: quoteId }), { status: 200, headers: SECURITY_HEADERS });

  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Submission Error', details: err.message }), { status: 500, headers: SECURITY_HEADERS });
  }
};

export const onRequestGet = async (context: { env: Env; request: Request }) => {
    const { env, request } = context;
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const secret = env.ADMIN_SECRET || "fallback_internal_secret_level_customs";

    if (!token || !(await verifyToken(token, secret))) {
        return new Response(JSON.stringify({ message: 'Unauthorized Access' }), { status: 401, headers: SECURITY_HEADERS });
    }

    try {
        const accessToken = await getAccessToken(env);
        const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values/Quotes!A:O`, { 
            headers: { 'Authorization': `Bearer ${accessToken}` } 
        });
        const data: any = await res.json();
        const rows = data.values || [];
        if (rows.length < 2) return new Response(JSON.stringify([]), { status: 200, headers: SECURITY_HEADERS });
        
        const quotes = rows.slice(1).map((row: any) => ({
            id: row[0], submissionDate: row[1], status: row[2],
            contact: { name: row[3], email: row[4], phone: row[5], company: row[6], message: row[7] },
            summary: row[8], colors: row[9], totalQty: row[10], totalAmount: row[11]
        }));
        return new Response(JSON.stringify(quotes), { status: 200, headers: SECURITY_HEADERS });
    } catch (err: any) { 
        return new Response(JSON.stringify({ message: 'Fetch Failure', details: err.message }), { status: 500, headers: SECURITY_HEADERS }); 
    }
};

export const onRequestPut = async (context: { env: Env; request: Request }) => {
    const { env, request } = context;
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const secret = env.ADMIN_SECRET || "fallback_internal_secret_level_customs";

    if (!token || !(await verifyToken(token, secret))) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: SECURITY_HEADERS });
    }

    try {
        const { quoteId, status } = await request.json() as any;
        const accessToken = await getAccessToken(env);
        const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values/Quotes!A:A`, { 
            headers: { 'Authorization': `Bearer ${accessToken}` } 
        });
        const data: any = await res.json();
        const rows = data.values || [];
        const rowIndex = rows.findIndex((row: any) => row[0] === quoteId) + 1;
        if (rowIndex === 0) return new Response(JSON.stringify({ message: 'Not Found' }), { status: 404, headers: SECURITY_HEADERS });
        
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values/Quotes!C${rowIndex}?valueInputOption=USER_ENTERED`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: [[status]] })
        });
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: SECURITY_HEADERS });
    } catch (err: any) { 
        return new Response(JSON.stringify({ message: 'Update Failure', details: err.message }), { status: 500, headers: SECURITY_HEADERS }); 
    }
};