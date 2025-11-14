// src/components/Footer.tsx
import Link from "next/link";
import { site } from "@/config/site";
import {
    Mail,
    Github,
    Facebook,
    Youtube,
    Linkedin,
    X as XIcon,
    Instagram,
    Rss,
    PenLine,
} from "lucide-react";

const icons = [
    { href: site.links.email, label: "Email", Icon: Mail },
    { href: site.links.github, label: "GitHub", Icon: Github },
    { href: site.links.facebook, label: "Facebook", Icon: Facebook },
    { href: site.links.youtube, label: "YouTube", Icon: Youtube },
    { href: site.links.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: site.links.x, label: "X", Icon: XIcon },
    { href: site.links.instagram, label: "Instagram", Icon: Instagram },
    { href: site.links.medium, label: "Medium", Icon: PenLine },
    // { href: "/rss.xml", label: "RSS", Icon: Rss },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-gray-200 dark:border-zinc-800 bg-slate-200 dark:bg-slate-900/50">
            <div className="max-w-4xl mx-auto p-6  text-center text-sm text-gray-600 dark:text-gray-400 space-y-4">
                {/* Icon Row */}
                <div className="flex justify-center gap-3 flex-wrap">
                    {icons.map(({ href, label, Icon }) => (
                        <Link
                            key={label}
                            href={href as any}
                            aria-label={label}
                            target={href.startsWith("http") ? "_blank" : "_self"}
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                        >
                            <Icon size={18} />
                        </Link>
                    ))}
                </div>

                {/* Divider + Text */}
                <div className="opacity-80">
                    <p>
                        {site.author} • © {site.since === year ? year : `${site.since}–${year}`} •{" "}
                        {site.title}
                    </p>
                    <p className="opacity-60 mt-1">{site.description}</p>
                </div>
            </div>
        </footer>
    );
}
