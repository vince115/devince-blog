//src/app/projects/page.tsx
import { allProjects } from "@/../.contentlayer/generated";
import ProjectsClient from "./ProjectsClient";
import { Suspense } from "react";

export const metadata = {
    title: "Projects",
    description: "My Projects",
};

export default function ProjectsPage() {
    // Server side 資料
    const projects = allProjects.sort((a, b) => +new Date(b.date) - +new Date(a.date));

    return (
        <Suspense fallback={<div className="text-center">Loading projects...</div>}>
            <ProjectsClient projects={projects} />
        </Suspense>
    );
}