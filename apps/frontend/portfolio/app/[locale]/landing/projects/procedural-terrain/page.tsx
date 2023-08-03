import Project from "App/[locale]/landing/(elements)/project/Projects";
import { Routes as ProjectApiRoutes } from "@hcabel/bridges/ProjectApi";
import ProceduralTerrainExperienceCanvas from "./ProceduralTerrainExperienceCanvas";

export default async function ProjectsPage() {
	const project = await ProjectApiRoutes.get_single_project("6339018aa4c9d89b6ed06751");
	return (
		<>
			<ProceduralTerrainExperienceCanvas />
			<Project
				project={project}
			/>
		</>
	);
}

export const revalidate = 60 * 60 * 24; /* each day */

// Tell nextjs to pre-render the pages where the dynamic params [locale] is "en" and "fr"
export async function generateStaticParams() {
	return [{ locale: "en" }, { locale: "fr" }];
}
