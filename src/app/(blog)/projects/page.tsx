// src/app/projects/page.tsx
import { getAllProjects } from "@/lib/payload-client";
import ProjectsClient from "./ProjectsClient";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Projects",
    description: "My Projects",
};

export default async function ProjectsPage() {
    const projects = await getAllProjects();

    return (
        <Suspense fallback={<div className="text-center">Loading projects...</div>}>
            <ProjectsClient projects={projects} />
        </Suspense>
    );
}