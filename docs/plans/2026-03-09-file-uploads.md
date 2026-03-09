# File Upload Feature — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow clients to upload brand assets, portfolio images, and profile photos directly from the form. Files are stored in Vercel Blob and their URLs are included in the email brief.

**Architecture:** Client-side file picker with drag-and-drop → uploads via `/api/upload` endpoint → stored in Vercel Blob → URLs saved in form state → included in email HTML + markdown when brief is sent.

**Tech Stack:** Vercel Blob (storage), existing React form (UI), existing Resend email (delivery)

---

### Task 1: Install Vercel Blob dependency

**Files:**
- Modify: `package.json`

**Step 1: Install the package**

Run: `npm install @vercel/blob`

**Step 2: Verify installation**

Run: `npm ls @vercel/blob`
Expected: `@vercel/blob@x.x.x`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add @vercel/blob dependency for file uploads"
```

---

### Task 2: Create the upload API endpoint

**Files:**
- Create: `api/upload.js`

**Step 1: Create the serverless function**

```javascript
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

        // Validate file type
        const allowed = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp', 'application/pdf'];
        if (!allowed.includes(contentType)) {
            return res.status(400).json({ error: 'File type not allowed' });
        }

        // Read raw body
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const body = Buffer.concat(chunks);

        // Validate size (10 MB max)
        if (body.length > 10 * 1024 * 1024) {
            return res.status(400).json({ error: 'File too large (max 10 MB)' });
        }

        // Upload to Vercel Blob
        const blob = await put(`briefs/${Date.now()}-${filename}`, body, {
            access: 'public',
            contentType,
        });

        return res.status(200).json({ url: blob.url, filename });
    } catch (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ error: 'Upload failed' });
    }
}
```

**Step 2: Commit**

```bash
git add api/upload.js
git commit -m "feat: add /api/upload endpoint with Vercel Blob storage"
```

---

### Task 3: Build the FileUpload UI component

**Files:**
- Modify: `src/Form.jsx` (add component after existing primitives, ~line 100)

**Step 1: Add the FileUpload primitive component**

Add after the existing `Sep` component in the PRIMITIVES section:

```javascript
function FileUpload({ files = [], onChange, accept = "image/*,.pdf,.svg", label = "Arrastra archivos aquí o haz clic para seleccionar", note, maxFiles = 5 }) {
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    const uploadFile = async (file) => {
        const res = await fetch("/api/upload", {
            method: "POST",
            headers: {
                "Content-Type": file.type,
                "x-filename": encodeURIComponent(file.name),
            },
            body: file,
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Upload failed");
        }
        return res.json();
    };

    const handleFiles = async (newFiles) => {
        const fileList = Array.from(newFiles);
        const remaining = maxFiles - files.length;
        if (remaining <= 0) return;
        const toUpload = fileList.slice(0, remaining);

        setUploading(true);
        try {
            const results = await Promise.all(
                toUpload.map(async (file) => {
                    const { url } = await uploadFile(file);
                    return { name: file.name, url, type: file.type, size: file.size };
                })
            );
            onChange([...files, ...results]);
        } catch (err) {
            console.error("Upload error:", err);
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (index) => {
        onChange(files.filter((_, i) => i !== index));
    };

    const isImage = (type) => type && type.startsWith("image/");

    return (
        <div>
            {/* Drop zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                onClick={() => inputRef.current?.click()}
                style={{
                    border: `2px dashed ${dragOver ? "#007AFF" : "#e8e8ed"}`,
                    borderRadius: 14,
                    padding: "24px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragOver ? "rgba(0,122,255,0.04)" : "#f8f8fa",
                    transition: "all 0.2s ease",
                }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple
                    onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
                    style={{ display: "none" }}
                />
                <div style={{ fontSize: 28, marginBottom: 8 }}>
                    {uploading ? "⏳" : "📎"}
                </div>
                <p style={{
                    fontSize: 13, color: uploading ? "#007AFF" : "#8e8e93",
                    fontFamily: "'Inter', sans-serif", fontWeight: 500, margin: 0,
                }}>
                    {uploading ? "Subiendo..." : label}
                </p>
                {note && (
                    <p style={{
                        fontSize: 11, color: "#adadb8", marginTop: 6,
                        fontFamily: "'Inter', sans-serif",
                    }}>{note}</p>
                )}
            </div>

            {/* File previews */}
            {files.length > 0 && (
                <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                    gap: 10, marginTop: 12,
                }}>
                    {files.map((f, i) => (
                        <div key={i} style={{
                            position: "relative", borderRadius: 10,
                            overflow: "hidden", border: "1px solid #e8e8ed",
                            background: "#f8f8fa",
                        }}>
                            {isImage(f.type) ? (
                                <img src={f.url} alt={f.name} style={{
                                    width: "100%", height: 80, objectFit: "cover", display: "block",
                                }} />
                            ) : (
                                <div style={{
                                    height: 80, display: "flex", alignItems: "center",
                                    justifyContent: "center", fontSize: 24,
                                }}>📄</div>
                            )}
                            <div style={{
                                padding: "6px 8px",
                                fontSize: 10, color: "#8e8e93",
                                fontFamily: "'Inter', sans-serif",
                                whiteSpace: "nowrap", overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>{f.name}</div>
                            <button
                                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                style={{
                                    position: "absolute", top: 4, right: 4,
                                    width: 22, height: 22, borderRadius: "50%",
                                    background: "rgba(0,0,0,0.55)", border: "none",
                                    color: "#fff", fontSize: 12, cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    lineHeight: 1,
                                }}
                            >×</button>
                        </div>
                    ))}
                </div>
            )}

            {/* Counter */}
            {files.length > 0 && (
                <p style={{
                    fontSize: 11, color: "#adadb8", marginTop: 6,
                    fontFamily: "'Inter', sans-serif",
                }}>{files.length} de {maxFiles} archivos</p>
            )}
        </div>
    );
}
```

**Step 2: Commit**

```bash
git add src/Form.jsx
git commit -m "feat: add FileUpload drag-and-drop component"
```

---

### Task 4: Add file uploads to StepIdentidad

**Files:**
- Modify: `src/Form.jsx` — `StepIdentidad` component (~line 272)

**Step 1: Add upload zones to StepIdentidad**

After the existing "Activos que ya tienes" Chips field (line ~278), add two file upload zones:

```javascript
// After the Chips for existingAssets
<Field label="Sube tu logo" note="SVG, PNG o JPG — máximo 10 MB">
    <FileUpload
        files={data.logoFiles || []}
        onChange={f("logoFiles")}
        accept="image/svg+xml,image/png,image/jpeg,image/webp"
        label="Arrastra tu logo aquí"
        note="SVG preferido para mejor calidad"
        maxFiles={3}
    />
</Field>
<Field label="Guía de marca u otros activos" note="PDF, imágenes de paleta, tipografías">
    <FileUpload
        files={data.brandFiles || []}
        onChange={f("brandFiles")}
        accept="image/*,.pdf,.svg,application/pdf,image/svg+xml"
        label="Arrastra archivos de marca"
        note="PDF de brand guidelines, paleta de colores, etc."
        maxFiles={5}
    />
</Field>
```

**Step 2: Commit**

```bash
git add src/Form.jsx
git commit -m "feat: add file uploads to Identidad step (logo + brand assets)"
```

---

### Task 5: Add file uploads to StepPortfolio

**Files:**
- Modify: `src/Form.jsx` — `StepPortfolio` component (~line 325)

**Step 1: Add upload zone to StepPortfolio**

After the "Proyectos a destacar" text field (line ~335), add:

```javascript
<Field label="Imágenes de proyectos" note="Screenshots, fotos, capturas de casos de éxito">
    <FileUpload
        files={data.portfolioFiles || []}
        onChange={f("portfolioFiles")}
        accept="image/png,image/jpeg,image/webp"
        label="Arrastra imágenes de tus proyectos"
        note="PNG o JPG — máximo 5 archivos"
        maxFiles={5}
    />
</Field>
```

**Step 2: Commit**

```bash
git add src/Form.jsx
git commit -m "feat: add file uploads to Portfolio step"
```

---

### Task 6: Add file uploads to StepAbout

**Files:**
- Modify: `src/Form.jsx` — `StepAbout` component (~line 365)

**Step 1: Add upload zone to StepAbout**

After the "Bio larga" field (line ~374), add:

```javascript
<Field label="Foto de perfil o equipo" note="La imagen principal para la sección About">
    <FileUpload
        files={data.profileFiles || []}
        onChange={f("profileFiles")}
        accept="image/png,image/jpeg,image/webp"
        label="Arrastra tu foto profesional"
        note="Recomendado: foto de alta calidad, bien iluminada"
        maxFiles={3}
    />
</Field>
```

**Step 2: Commit**

```bash
git add src/Form.jsx
git commit -m "feat: add file uploads to About step (profile photos)"
```

---

### Task 7: Update config.js — include file URLs in brief sections + markdown

**Files:**
- Modify: `src/config.js`

**Step 1: Add file data to getBriefSections()**

Add file rows to the relevant sections:

- In the IDENTIDAD section, add:
  ```javascript
  ["Logo", (data.logoFiles || []).map(f => f.url).join(", ")],
  ["Brand assets", (data.brandFiles || []).map(f => f.url).join(", ")],
  ```

- In the CONTENIDO/TRABAJOS section (or add a new PORTFOLIO section), add:
  ```javascript
  ["Imágenes portfolio", (data.portfolioFiles || []).map(f => f.url).join(", ")],
  ```

- In the HISTORIA section, add:
  ```javascript
  ["Fotos", (data.profileFiles || []).map(f => f.url).join(", ")],
  ```

**Step 2: Update generateMarkdown()**

The markdown generator uses getBriefSections() so file URLs will automatically appear. But we should format file URLs as markdown links for better readability. Update the markdown row formatter:

```javascript
rows.forEach(([k, v]) => {
    // If value contains Vercel Blob URLs, format as markdown links
    if (typeof v === 'string' && v.includes('vercel-storage.com')) {
        const urls = v.split(', ').filter(Boolean);
        md += `- **${k}**:\n`;
        urls.forEach(url => {
            const name = decodeURIComponent(url.split('/').pop().replace(/^\d+-/, ''));
            md += `  - [${name}](${url})\n`;
        });
    } else {
        md += `- **${k}**: ${v}\n`;
    }
});
```

**Step 3: Commit**

```bash
git add src/config.js
git commit -m "feat: include uploaded file URLs in brief sections and markdown"
```

---

### Task 8: Update email template to show uploaded files

**Files:**
- Modify: `api/send-brief.js`

**Step 1: Add an "Archivos adjuntos" section to the email HTML**

After the existing `sectionHTML`, add a new section that lists all uploaded files with clickable links:

```javascript
// After sectionHTML generation, before the final HTML template
const fileGroups = [
    { label: "Logo", files: data.logoFiles || [] },
    { label: "Brand assets", files: data.brandFiles || [] },
    { label: "Portfolio", files: data.portfolioFiles || [] },
    { label: "Fotos perfil", files: data.profileFiles || [] },
];
const hasFiles = fileGroups.some(g => g.files.length > 0);

const filesHTML = hasFiles ? `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-radius:12px;overflow:hidden;border:1px solid #f0f0f5;">
    <tr><td style="background:#1d1d1f;padding:12px 18px;">
        <span style="color:#fff;font-size:13px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">📎 Archivos Adjuntos</span>
    </td></tr>
    ${fileGroups.filter(g => g.files.length > 0).map(g => g.files.map(f => `
    <tr><td style="padding:10px 18px;border-bottom:1px solid #f5f5f7;font-family:'Helvetica Neue',Arial,sans-serif;">
        <span style="font-size:12px;color:#8e8e93;font-weight:600;display:inline-block;width:120px;vertical-align:top;">${g.label}</span>
        <a href="${f.url}" style="font-size:13px;color:#007AFF;text-decoration:none;" target="_blank">${f.name}</a>
    </td></tr>`).join("")).join("")}
</table>` : "";
```

Then include `${filesHTML}` in the HTML template after `${sectionHTML}`.

**Step 2: Commit**

```bash
git add api/send-brief.js
git commit -m "feat: show uploaded files as links in email brief"
```

---

### Task 9: Update Summary component to show uploaded files

**Files:**
- Modify: `src/Form.jsx` — `Summary` component

**Step 1: Find the Summary component and add file previews**

The Summary component uses `getBriefSections(data)` which now includes file URLs. But raw URLs aren't pretty. Add a dedicated "Archivos" section at the end of the Summary that shows image thumbnails:

```javascript
// Inside Summary, after the sections map, before the send button
const allFiles = [
    ...(data.logoFiles || []).map(f => ({ ...f, category: "Logo" })),
    ...(data.brandFiles || []).map(f => ({ ...f, category: "Brand" })),
    ...(data.portfolioFiles || []).map(f => ({ ...f, category: "Portfolio" })),
    ...(data.profileFiles || []).map(f => ({ ...f, category: "Perfil" })),
];

{allFiles.length > 0 && (
    <SectionCard title="Archivos subidos">
        <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
            gap: 8,
        }}>
            {allFiles.map((f, i) => (
                <div key={i} style={{
                    borderRadius: 8, overflow: "hidden",
                    border: "1px solid #e8e8ed", background: "#f8f8fa",
                }}>
                    {f.type?.startsWith("image/") ? (
                        <img src={f.url} alt={f.name} style={{
                            width: "100%", height: 64, objectFit: "cover", display: "block",
                        }} />
                    ) : (
                        <div style={{
                            height: 64, display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: 20,
                        }}>📄</div>
                    )}
                    <div style={{
                        padding: "4px 6px", fontSize: 9, color: "#8e8e93",
                        fontFamily: "'Inter', sans-serif",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                        <span style={{
                            fontSize: 8, color: "#007AFF", fontWeight: 600,
                            display: "block", marginBottom: 1,
                        }}>{f.category}</span>
                        {f.name}
                    </div>
                </div>
            ))}
        </div>
    </SectionCard>
)}
```

**Step 2: Commit**

```bash
git add src/Form.jsx
git commit -m "feat: show uploaded file previews in Summary"
```

---

### Task 10: Configure Vercel Blob token and deploy

**Step 1: Add BLOB_READ_WRITE_TOKEN to Vercel**

Run: `npx vercel env add BLOB_READ_WRITE_TOKEN production`

The token is obtained from the Vercel dashboard:
1. Go to project settings → Storage → Create Blob Store
2. Copy the BLOB_READ_WRITE_TOKEN

**Step 2: Deploy**

Run: `npx vercel --prod`

**Step 3: Test the upload flow**

1. Open the form
2. Navigate to the Identidad step
3. Upload a test image
4. Verify it appears in the preview
5. Submit the form
6. Check email for file links

**Step 4: Commit any final adjustments and push**

```bash
git add -A
git commit -m "feat: complete file upload feature with Vercel Blob"
git push
```

---

## File upload constraints

| Constraint | Value |
|-----------|-------|
| Max file size | 10 MB per file |
| Max files per zone | 3-5 (varies by step) |
| Allowed types | SVG, PNG, JPG, WebP, PDF |
| Storage | Vercel Blob (public access) |
| Total upload zones | 4 (across 3 steps) |

## Steps with uploads

| Step | Field key | What | Max files |
|------|-----------|------|-----------|
| Identidad | `logoFiles` | Logo files | 3 |
| Identidad | `brandFiles` | Brand guidelines, palette, etc. | 5 |
| Portfolio | `portfolioFiles` | Project screenshots | 5 |
| About | `profileFiles` | Profile/team photos | 3 |
