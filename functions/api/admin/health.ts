
interface Env {
  // Use any to bypass KVNamespace build error
  STATSCUSTOMSDATA: any;
  GOOGLE_SHEET_ID: string;
  ADMIN_SECRET: string;
}

export const onRequestGet = async (context: { env: Env; request: Request }) => {
  const { env, request } = context;
  
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  try {
    const health = {
        kv: !!env.STATSCUSTOMSDATA,
        sheets: !!env.GOOGLE_SHEET_ID,
        timestamp: new Date().toISOString(),
        region: request.headers.get('cf-ipcountry') || 'Global'
    };

    return new Response(JSON.stringify(health), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ status: 'failure' }), { status: 500 });
  }
};
