import Project from "App/[locale]/landing/(elements)/project/Projects";
import EnterLeaveAnimation from "../(shared)/EnterLeaveAnimation";
import { GetProjectData } from "../(shared)/getProjectDataFromApi";

import Style from "../(shared)/project.module.scss";
import HugoMeetExperienceCanvas from "./HugoMeetExperienceCanvas";

export default async function ProjectsPage()
{
	const project = await GetProjectData("6345e3b7af50b4452641831f");
	return (
		<EnterLeaveAnimation>
			<HugoMeetExperienceCanvas />
			<Project
				project={project}
				className={Style.Project}
				moreButtonRedirection={"/redirects/hugomeet"}
				moreTextOverride={"Go to HugoMeet"}
				i18n
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
