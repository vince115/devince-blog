// src/components/SocialIcon.tsx
"use client";
import Link from "next/link";
import {
    Github, Linkedin, Mail, X as XIcon, Instagram,
} from "lucide-react";

export function SocialIconRow({ size = 18, className = "" }: { size?: number; className?: string }) {
    const C = "p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition";
    const icons = [
        { href: "/api/mailto", label: "Email", Icon: Mail }, // 需要可改成直接 mailto
        { href: "https://github.com/vince115", label: "GitHub", Icon: Github },
        { href: "https://www.linkedin.com/", label: "LinkedIn", Icon: Linkedin },
        { href: "https://x.com/", label: "X", Icon: XIcon },
        { href: "https://instagram.com/", label: "Instagram", Icon: Instagram },
    ];
    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            {icons.map(({ href, label, Icon }) => (
                <Link key={label} href={href} aria-label={label} className={C}>
                    <Icon size={size} />
                </Link>
            ))}
        </div>
    );
}
