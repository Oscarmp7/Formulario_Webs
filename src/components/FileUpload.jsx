import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { IconUpload, IconFile, IconImage, IconClose, IconLoading } from "./icons.jsx";

// Dropzone con dashed rule border. Drag-over = signal border + paper-tint bg.
// Archivos van directo del browser a Vercel Blob (bypass del límite serverless de 4.5 MB).
// No emojis. Custom SVG icons. Errors visibles, retry implícito.

const ACCEPTED_TYPES = {
    image: "image/svg+xml,image/png,image/jpeg,image/webp",
    logo: "image/svg+xml,image/png,image/jpeg,image/webp,.ai",
    document: "application/pdf",
    all: "image/svg+xml,image/png,image/jpeg,image/webp,application/pdf",
};

export function FileUpload({
    files = [],
    onChange,
    accept = "all",
    multiple = true,
    maxFiles = 5,
    maxSizeMB = 500,
    label = "Subir archivos",
    hint,
}) {
    const inputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFiles = async (fileList) => {
        if (!fileList || fileList.length === 0) return;
        setError("");
        const arr = Array.from(fileList);
        const available = maxFiles - files.length;
        if (available <= 0) {
            setError(`Máximo ${maxFiles} archivos.`);
            return;
        }
        const toUpload = arr.slice(0, available);

        setUploading(true);
        const uploaded = [];
        for (const file of toUpload) {
            if (file.size > maxSizeMB * 1024 * 1024) {
                setError(`${file.name} excede ${maxSizeMB} MB.`);
                continue;
            }
            try {
                const blob = await upload(
                    `briefs/${file.name}`,
                    file,
                    {
                        access: "public",
                        handleUploadUrl: "/api/upload-token",
                    }
                );
                uploaded.push({ url: blob.url, filename: file.name, size: file.size });
            } catch (err) {
                setError(`No se pudo subir ${file.name}. ${err.message}`);
            }
        }
        onChange([...files, ...uploaded]);
        setUploading(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    };

    const remove = (idx) => {
        const next = files.filter((_, i) => i !== idx);
        onChange(next);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        inputRef.current?.click();
                    }
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                aria-disabled={uploading}
                style={{
                    border: `1px dashed ${dragOver ? "var(--signal)" : "var(--rule)"}`,
                    background: dragOver ? "var(--paper-tint)" : "transparent",
                    padding: "24px 20px",
                    cursor: uploading ? "wait" : "pointer",
                    transition:
                        "border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out)",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    minHeight: "72px",
                }}
            >
                <div
                    style={{
                        color: dragOver ? "var(--signal)" : "var(--ink-soft)",
                        display: "flex",
                        transition: "color var(--duration-fast) var(--ease-out)",
                    }}
                >
                    {uploading ? <IconLoading width="22" height="22" /> : <IconUpload width="22" height="22" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.9375rem",
                            fontWeight: 500,
                            color: "var(--ink)",
                            marginBottom: "4px",
                        }}
                    >
                        {uploading ? "Subiendo..." : label}
                    </div>
                    {hint && (
                        <div
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "0.8125rem",
                                color: "var(--ink-soft)",
                                lineHeight: 1.4,
                            }}
                        >
                            {hint}
                        </div>
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPTED_TYPES[accept] || ACCEPTED_TYPES.all}
                    multiple={multiple}
                    onChange={(e) => handleFiles(e.target.files)}
                    style={{ display: "none" }}
                />
            </div>

            {error && (
                <div
                    role="alert"
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                        color: "var(--danger)",
                    }}
                >
                    {error}
                </div>
            )}

            {files.length > 0 && (
                <ul style={{ display: "flex", flexDirection: "column", gap: "6px", listStyle: "none", margin: 0, padding: 0 }}>
                    {files.map((f, idx) => (
                        <li
                            key={f.url}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "8px 0",
                                borderBottom: idx === files.length - 1 ? "none" : "1px solid var(--rule)",
                            }}
                        >
                            <div style={{ color: "var(--ink-soft)", display: "flex" }}>
                                {f.filename?.match(/\.(png|jpg|jpeg|webp|svg)$/i) ? (
                                    <IconImage width="16" height="16" />
                                ) : (
                                    <IconFile width="16" height="16" />
                                )}
                            </div>
                            <span
                                style={{
                                    flex: 1,
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.8125rem",
                                    color: "var(--ink)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                                title={f.filename}
                            >
                                {f.filename}
                            </span>
                            <button
                                type="button"
                                onClick={() => remove(idx)}
                                aria-label={`Eliminar ${f.filename}`}
                                style={{
                                    background: "transparent",
                                    border: 0,
                                    color: "var(--ink-soft)",
                                    cursor: "pointer",
                                    padding: "4px",
                                    display: "flex",
                                    transition: "color var(--duration-fast) var(--ease-out)",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-soft)")}
                            >
                                <IconClose width="16" height="16" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
