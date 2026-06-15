// src/app/about/page.tsx
import { getAuthorBySlug } from "@/lib/payload-client";
import AboutClient from "./AboutClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const metadata = { title: "About", description: "About Me" };

export default async function AboutPage() {
    const author = await getAuthorBySlug("default");

    if (!author) return <div>Author not found</div>;

    return (
        <Suspense fallback={<div>Loading about...</div>}>
            <AboutClient author={author} />
        </Suspense>
    );
}
