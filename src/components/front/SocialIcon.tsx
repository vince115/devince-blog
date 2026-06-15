// src/components/SocialIcon.tsx
"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, X as XIcon, Instagram } from "lucide-react";

export function SocialIconRow({
    size = 18,
    className = "",
}: {
    size?: number;
    className?: string;
}) {
    const C =
        "p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition";

    // ✅ 使用真正的 mailto，外部連結都開新分頁
    const icons = [
        { href: "mailto:vince115@gmail.com", label: "Email", Icon: Mail },
        { href: "https://github.com/vince115", label: "GitHub", Icon: Github },
        { href: "https://www.linkedin.com/in/vince-lo-06a9928b/", label: "LinkedIn", Icon: Linkedin },
        { href: "https://x.com/vince115tw", label: "X", Icon: XIcon },
        { href: "https://www.instagram.com/vince115", label: "Instagram", Icon: Instagram },
    ];

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            {icons.map(({ href, label, Icon }) => (
                <Link
                    key={label}
                    href={href as any}
                    aria-label={label}
                    target={href.startsWith("http") ? "_blank" : "_self"}
                    rel={
                        href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                    }
                    className={C}
                >
                    <Icon size={size} />
                </Link>
            ))}
        </div>
    );
}
