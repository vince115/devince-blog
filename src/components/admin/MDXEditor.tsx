"use client";

import React, { useRef, useState } from "react";
import { useField } from "@payloadcms/ui";

export function MDXEditor({ path, label }: { path: string; label?: string }) {
    const { value, setValue } = useField<string>({ path });
    const [isUploading, setIsUploading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            // 處理純文字貼上：自動判斷 Instagram 網址
            if (item.type === "text/plain") {
                item.getAsString((text) => {
                    const igRegex = /^https:\/\/(www\.)?instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)\/?/;
                    if (igRegex.test(text.trim())) {
                        e.preventDefault();
                        const mdInstagram = `\n<Instagram url="${text.trim()}" />\n`;
                        const el = textareaRef.current;
                        if (el) {
                            const start = el.selectionStart;
                            const end = el.selectionEnd;
                            const currentVal = el.value || "";
                            const newText =
                                currentVal.substring(0, start) +
                                mdInstagram +
                                currentVal.substring(end);
                            setValue(newText);
                            setTimeout(() => {
                                el.selectionStart = el.selectionEnd = start + mdInstagram.length;
                                el.focus();
                            }, 0);
                        } else {
                            setValue((value || "") + mdInstagram);
                        }
                    }
                });
            }

            if (item.type.indexOf("image") !== -1) {
                e.preventDefault(); // 阻止原本的貼上行為
                const file = item.getAsFile();
                if (!file) continue;

                setIsUploading(true);

                try {
                    // 根據 MIME 類型確定副檔名，確保貼上的圖片有正確的檔名與副檔名
                    const extension = file.type.split("/")[1] || "png";
                    const safeFilename = `paste-${Date.now()}.${extension}`;

                    const formData = new FormData();
                    formData.append("file", file, safeFilename);

                    // 呼叫 Payload 內建的 media API 上傳圖片，並確保攜帶 Session Cookie
                    const res = await fetch("/api/media", {
                        method: "POST",
                        body: formData,
                        credentials: "same-origin",
                    });

                    const data = await res.json();
                    const uploadedDoc = data?.doc || data;
                    const imageUrl = uploadedDoc?.url;
                    const filename = uploadedDoc?.filename;

                    if (res.ok && imageUrl) {
                        // 產生 Markdown 圖片語法 (使用 encodeURI 確保網址中的空格被轉譯成 %20)
                        const encodedUrl = encodeURI(imageUrl);
                        const mdImage = `\n![${filename || "image"}](${encodedUrl})\n`;

                        // 在游標位置插入語法
                        const el = textareaRef.current;
                        if (el) {
                            const start = el.selectionStart;
                            const end = el.selectionEnd;
                            const currentVal = el.value || "";
                            const newText =
                                currentVal.substring(0, start) +
                                mdImage +
                                currentVal.substring(end);

                            setValue(newText);

                            // 恢復游標位置
                            setTimeout(() => {
                                el.selectionStart = el.selectionEnd = start + mdImage.length;
                                el.focus();
                            }, 0);
                        } else {
                            setValue((value || "") + mdImage);
                        }
                    } else {
                        console.error(`Upload failed (Status ${res.status} ${res.statusText}):`, data);
                        alert(`圖片上傳失敗 (錯誤碼 ${res.status})，請稍後再試。`);
                    }
                } catch (error) {
                    console.error("Paste upload error:", error);
                    alert("圖片上傳發生錯誤，請檢查網路連線！");
                } finally {
                    setIsUploading(false);
                }
            }
        }
    };

    return (
        <div className="field-type textarea">
            {label && (
                <label className="field-label">
                    {label}
                    <span className="required">*</span>
                </label>
            )}
            <div className="field-description" style={{ marginBottom: "0.5rem", color: "#9ca3af", fontSize: "0.875rem" }}>
                支援 Markdown / MDX 語法。💡 <b>支援直接貼上截圖 (Ctrl+V) 自動上傳，以及貼上 Instagram 網址自動轉換為內嵌貼文！</b>
            </div>
            <div style={{ position: "relative" }}>
                <textarea
                    ref={textareaRef}
                    value={value || ""}
                    onChange={(e) => setValue(e.target.value)}
                    onPaste={handlePaste}
                    rows={40}
                    style={{
                        width: "100%",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        padding: "1rem",
                        backgroundColor: "var(--theme-elevation-50)",
                        color: "var(--theme-elevation-800)",
                        border: "1px solid var(--theme-elevation-150)",
                        borderRadius: "4px",
                        lineHeight: "1.6",
                        resize: "vertical"
                    }}
                    disabled={isUploading}
                    placeholder="開始撰寫您的 MDX 文章..."
                />
                {isUploading && (
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "rgba(20, 184, 166, 0.9)", // Teal-500
                            color: "white",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            zIndex: 10,
                        }}
                    >
                        ⏳ 圖片上傳中...
                    </div>
                )}
            </div>
        </div>
    );
}
