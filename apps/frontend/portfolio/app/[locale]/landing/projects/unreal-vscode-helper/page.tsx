import Project from "App/[locale]/landing/(elements)/project/Projects";
import { Routes as ProjectApiRoutes } from "@hcabel/bridges/ProjectApi";
import UvchExperienceCanvas from "./UvchExperienceCanvas";

export default async function ProjectsPage() {
	const project = await ProjectApiRoutes.get_single_project("6345e3b3af50b4452641831e");
	return (
		<>
			<UvchExperienceCanvas />
			<Project
				project={project}
				style={{
					position: "relative",
					padding: "5%",
					boxSizing: "border-box",
					height: "100vh",
					width: "60vw",
				}}
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
