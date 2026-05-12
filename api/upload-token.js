import { handleUpload } from "@vercel/blob/client";

const ALLOWED_TYPES = [
    "image/svg+xml",
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/pdf",
    "application/postscript",    // .ai files
    "application/octet-stream",  // .ai files fallback
];

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    try {
        const jsonResponse = await handleUpload({
            body: req.body,
            request: req,
            onBeforeGenerateToken: async (pathname) => ({
                allowedContentTypes: ALLOWED_TYPES,
                maximumSizeInBytes: 500 * 1024 * 1024,
                addRandomSuffix: true,
                tokenPayload: JSON.stringify({ folder: "briefs" }),
            }),
            onUploadCompleted: async ({ blob }) => {
                console.log("Upload completed:", blob.pathname);
            },
        });
        return res.json(jsonResponse);
    } catch (err) {
        console.error("Upload token error:", err);
        return res.status(400).json({ error: err.message });
    }
}
