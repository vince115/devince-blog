// src/app/about/page.tsx
import { allAuthors } from "@/../.contentlayer/generated";
import AboutClient from "./AboutClient";
import { Suspense } from "react";

export const metadata = { title: "About", description: "About Me" };

export default function AboutPage() {
    // 伺服端找作者
    const author = allAuthors.find((p) => p.slug === "default");

    if (!author) return <div>Author not found</div>;
    
    return (
        <Suspense fallback={<div>Loading about...</div>}>
            <AboutClient author={author}/>
        </Suspense>
    );
}
