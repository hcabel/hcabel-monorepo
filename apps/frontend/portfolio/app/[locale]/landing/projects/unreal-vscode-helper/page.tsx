import Project from "App/[locale]/landing/(elements)/project/Projects";
import { Routes as ProjectApiRoutes } from "@hcabel/bridges/ProjectApi";
import UvchExperienceCanvas from "./UvchExperienceCanvas";

export default async function ProjectsPage() {
	const project = await ProjectApiRoutes.get_single_project("633900a7471d8a488d9ab4a3");
	return (
		<>
			<UvchExperienceCanvas />
			<Project
				project={project}
				moreButtonRedirection="/redirects/unreal-vscode-helper"
			/>
		</>
	);
}

export const revalidate = 60 * 60 * 24; /* each day */

// Tell nextjs to pre-render the pages where the dynamic params [locale] is "en" and "fr"
export async function generateStaticParams() {
	return [{ locale: "en" }, { locale: "fr" }];
}
