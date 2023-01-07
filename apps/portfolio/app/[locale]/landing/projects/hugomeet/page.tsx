import Project from "App/[locale]/(clients)/project/Projects";
import { GetProjectData } from "../(shared)/getProjectDataFromApi";

import Style from "../(shared)/project.module.scss";

export default async function ProjectsPage()
{
	const project = await GetProjectData("6345e3b7af50b4452641831f", { next: { revalidate: 60 * 60 * 24 /* each day */ }});
	return (
		<Project
			project={project}
			className={Style.Project}
			moreButtonRedirection={"/redirects/hugomeet"}
			moreTextOverride={"Go to HugoMeet"}
			i18n
		/>
	);
}