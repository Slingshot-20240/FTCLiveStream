import { json } from '@sveltejs/kit';

// In-memory store for the URLs
let field1Url = 'about:blank';
let field2Url = 'about:blank';

export function GET() {
    return json({
        field1: field1Url,
        field2: field2Url
    }, {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });
}

export async function POST({ request }: { request: Request }) {
    try {
        const data = await request.json();
        if (data.field1 !== undefined) field1Url = data.field1;
        if (data.field2 !== undefined) field2Url = data.field2;
        return json({ success: true });
    } catch (err) {
        return json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }
}

export function OPTIONS() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
