//src/app/projects/page.tsx
import { allProjects } from "@/../.contentlayer/generated";
import ProjectsClient from "./ProjectsClient";

export const metadata = {
    title: "Projects",
    description: "My Projects",
};

export default function ProjectsPage() {
    // Server side 資料
    const projects = allProjects.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    return <ProjectsClient projects={projects} />;
}