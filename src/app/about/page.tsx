// src/app/about/page.tsx
import { allAuthors } from "@/../.contentlayer/generated";
import AboutClient from "./AboutClient";

export const metadata = { title: "About", description: "About Me" };

export default function AboutPage() {
    // 伺服端找作者
    const author = allAuthors.find((p) => p.slug === "default");

    if (!author) return <div>Author not found</div>;

    // 把 author 資料傳給 client component
    return <AboutClient author={author} />;
}
