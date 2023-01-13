import Project from "App/[locale]/landing/(elements)/project/Projects";
import { GetProjectData } from "../(shared)/getProjectDataFromApi";
import UvchExperienceCanvas from "./UvchExperienceCanvas";

import Style from "../(shared)/project.module.scss";

export default async function ProjectsPage()
{
	const project = await GetProjectData("6345e3b3af50b4452641831e", { next: { revalidate: 60 * 60 * 24 /* each day */ }});

	return (
		<>
			<UvchExperienceCanvas />
			<Project
				project={project}
				className={Style.Project}
				moreButtonRedirection="/redirects/unreal-vscode-helper"
			/>
		</>
	);
}

export const revalidate = 60 * 60 * 24; /* each day */

// Tell nextjs to pre-render the pages where the dynamic params [locale] is "en" and "fr"
export async function generateStaticParams()
{
	return ([
		{ locale: "en" },
		{ locale: "fr" }
	]);
}
