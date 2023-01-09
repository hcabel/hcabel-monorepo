import Project from "App/[locale]/landing/(elements)/project/Projects";
import EnterLeaveAnimation from "../(shared)/EnterLeaveAnimation";
import { GetProjectData } from "../(shared)/getProjectDataFromApi";
import ProceduralTerrainExperienceCanvas from "./ProceduralTerrainExperienceCanvas";

import Style from "../(shared)/project.module.scss";

export default async function ProjectsPage()
{
	const project = await GetProjectData("6345e3b8af50b44526418320", { next: { revalidate: 60 * 60 * 24 /* each day */ }});
	return (
		<EnterLeaveAnimation>
			<ProceduralTerrainExperienceCanvas />
			<Project
				project={project}
				className={Style.Project}
			/>
		</EnterLeaveAnimation>
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
