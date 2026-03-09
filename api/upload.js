import { put } from '@vercel/blob';

export const config = {
    api: { bodyParser: false },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const filename = req.headers['x-filename'];
        const contentType = req.headers['content-type'];

        if (!filename) {
            return res.status(400).json({ error: 'Missing x-filename header' });
        }

        const allowed = [
            'image/svg+xml', 'image/png', 'image/jpeg', 'image/webp', 'application/pdf',
        ];
        if (!allowed.includes(contentType)) {
            return res.status(400).json({ error: 'File type not allowed' });
        }

        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const body = Buffer.concat(chunks);

        if (body.length > 10 * 1024 * 1024) {
            return res.status(400).json({ error: 'File too large (max 10 MB)' });
        }

        const blob = await put(`briefs/${Date.now()}-${decodeURIComponent(filename)}`, body, {
            access: 'public',
            contentType,
        });

        return res.status(200).json({ url: blob.url, filename: decodeURIComponent(filename) });
    } catch (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ error: 'Upload failed' });
    }
}
