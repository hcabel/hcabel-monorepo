import Project from "App/[locale]/(clients)/project/Projects";
import { ILocaleLayoutProps } from "App/[locale]/layout";
import i18nText from "Utils/i18Text";
import { GetProjectData } from "../(shared)/getProjectDataFromApi";

import Style from "../(shared)/project.module.scss";

export default async function ProjectsPage(props: ILocaleLayoutProps)
{
	const project = await GetProjectData("6345e3b7af50b4452641831f", { next: { revalidate: 60 * 60 * 24 /* each day */ }});
	return (
		<Project
			locale={props.params.locale}
			project={project}
			className={Style.Project}
			moreButtonRedirection={"/redirects/hugomeet"}
			moreTextOverride={i18nText("Go to HugoMeet", props.params.locale)}
		/>
	);
}