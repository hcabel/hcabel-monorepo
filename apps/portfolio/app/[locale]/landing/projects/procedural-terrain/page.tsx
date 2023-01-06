import Project from "App/[locale]/(clients)/project/Projects";
import { ILocaleLayoutProps } from "App/[locale]/layout";
import { GetProjectData } from "../(shared)/getProjectDataFromApi";

import Style from "../(shared)/project.module.scss";

export default async function ProjectsPage(props: ILocaleLayoutProps)
{
	const project = await GetProjectData("6345e3b8af50b44526418320", { next: { revalidate: 60 * 60 * 24 /* each day */ }});
	return (
		<Project
			locale={props.params.locale}
			project={project}
			className={Style.Project}
		/>
	);
}