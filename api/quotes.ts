import { google } from 'googleapis';
import { SubmittedQuote, QuoteStatus } from '../types';

export const config = {
  runtime: 'nodejs',
};

function getEnvVariable(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Environment variable ${name} is not set.`);
    return value;
}

function isAuthenticated(req: Request): boolean {
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const expectedToken = `${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`;
        return token === expectedToken;
    }
    return false;
}

async function getSheetsService() {
    const privateKey = getEnvVariable('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n');
    const clientEmail = getEnvVariable('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    const auth = new google.auth.GoogleAuth({
        credentials: { client_email: clientEmail, private_key: privateKey },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return google.sheets({ version: 'v4', auth });
}

export default async function handler(req: Request): Promise<Response> {
    try {
        switch (req.method) {
            case 'POST': return handlePost(req);
            case 'GET': return handleGet(req);
            case 'PUT': return handlePut(req);
            default: return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
        }
    } catch (error: any) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}

async function handlePost(req: Request): Promise<Response> {
    const body = await req.json();
    const { contact, items, type } = body;

    if (!contact?.email) return new Response(JSON.stringify({ message: 'Email required' }), { status: 400 });
    
    const sheets = await getSheetsService();
    const sheetId = getEnvVariable('GOOGLE_SHEET_ID');
    const quoteId = type === 'direct_order' ? `ORD-${Date.now()}` : `QT-${Date.now()}`;
    const timestamp = new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' });

    let totalAmount = 0;
    const summaryParts: string[] = [];
    items.forEach((item: any) => {
        let qty = 0;
        const breakdown: string[] = [];
        Object.entries(item.sizeQuantities).forEach(([s, q]) => {
            if (Number(q) > 0) {
                breakdown.push(`${s} x${q}`);
                qty += Number(q);
            }
        });
        if (qty > 0) {
            totalAmount += (item.unitPrice * qty);
            summaryParts.push(`${item.product.name} [${item.selectedColor.name}] (${breakdown.join(', ')})`);
        }
    });

    const newRow = [
        quoteId,
        timestamp,
        'New',
        type === 'direct_order' ? 'Direct Order' : 'Quote Request',
        contact.name,
        contact.email,
        contact.phone || '',
        contact.address || 'N/A',
        contact.deliveryMethod || 'N/A',
        contact.paymentMethod || 'N/A',
        contact.company || '',
        contact.message || '',
        summaryParts.join(' | '),
        totalAmount,
        JSON.stringify(body)
    ];

    await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Quotes!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [newRow] },
    });

    return new Response(JSON.stringify({ success: true, id: quoteId }), { status: 200 });
}

async function handleGet(req: Request): Promise<Response> {
    if (!isAuthenticated(req)) return new Response('Unauthorized', { status: 401 });
    const sheets = await getSheetsService();
    const sheetId = getEnvVariable('GOOGLE_SHEET_ID');
    const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'Quotes!A:O' });
    const rows = res.data.values || [];
    if (rows.length < 2) return new Response('[]', { status: 200 });

    const quotes = rows.slice(1).map(row => ({
        id: row[0], submissionDate: row[1], status: row[2], type: row[3],
        contact: { name: row[4], email: row[5], phone: row[6], address: row[7], delivery: row[8], payment: row[9], company: row[10], message: row[11] },
        summary: row[12], total: row[13], items: JSON.parse(row[14] || '{}').items || []
    }));
    return new Response(JSON.stringify(quotes), { status: 200 });
}

async function handlePut(req: Request): Promise<Response> {
    if (!isAuthenticated(req)) return new Response('Unauthorized', { status: 401 });
    const { quoteId, status } = await req.json();
    const sheets = await getSheetsService();
    const sheetId = getEnvVariable('GOOGLE_SHEET_ID');
    const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'Quotes!A:A' });
    const rows = res.data.values || [];
    const rowIndex = rows.findIndex(r => r[0] === quoteId) + 1;
    if (rowIndex === 0) return new Response('Not found', { status: 404 });
    
    await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `Quotes!C${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[status]] },
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
}