
interface Env {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_PRIVATE_KEY: string;
  GOOGLE_SHEET_ID: string;
}

// Helper to sign JWT using Web Crypto API (Edge compatible)
async function signJwt(email: string, privateKey: string, scope: string) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: email,
    scope: scope,
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedClaim = btoa(JSON.stringify(claim)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const message = `${encodedHeader}.${encodedClaim}`;

  // Clean the private key string
  const pemContents = privateKey
    .replace(/\\n/g, '\n')
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
    
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(message)
  );

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${message}.${encodedSignature}`;
}

async function getAccessToken(env: Env) {
  const jwt = await signJwt(env.GOOGLE_SERVICE_ACCOUNT_EMAIL, env.GOOGLE_PRIVATE_KEY, 'https://www.googleapis.com/auth/spreadsheets');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });
  const data: any = await res.json();
  return data.access_token;
}

export const onRequestGet = async (context: { env: Env; params: { id: string } }) => {
  const { env, params } = context;
  const quoteId = params.id;

  try {
    const token = await getAccessToken(env);
    // Fetch columns A through I to get ID, Status, Name, etc.
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values/Quotes!A:O`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data: any = await res.json();
    const rows = data.values || [];
    
    // Find the specific row by ID (Column A is index 0)
    const row = rows.find((r: any) => r[0] === quoteId);

    if (!row) {
        return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 });
    }

    // Return partial/safe data for public tracking
    // Parsing the JSON stored in the last column (Column O, index 14) for item details
    let items = [];
    try {
        const rawJson = row[14];
        if (rawJson) {
            const parsed = JSON.parse(rawJson);
            if (parsed.items) {
                items = parsed.items.map((item: any) => ({
                    product: { name: item.product.name } 
                }));
            }
        }
    } catch (e) {
        // Fallback if JSON parsing fails
    }

    const quote = {
      id: row[0],
      submissionDate: row[1],
      status: row[2],
      contact: {
        name: row[3], // Keep name for verification
      },
      items: items
    };

    return new Response(JSON.stringify(quote), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'System processing error', details: err.message }), { status: 500 });
  }
};
