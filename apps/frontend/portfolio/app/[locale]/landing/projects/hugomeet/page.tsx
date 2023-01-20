import Project from "App/[locale]/landing/(elements)/project/Projects";
import { GetProjectData } from "../../(utils)/getProjectDataFromApi";

import HugoMeetExperienceCanvas from "./HugoMeetExperienceCanvas";

export default async function ProjectsPage() {
	const project = await GetProjectData("6345e3b7af50b4452641831f");
	return (
		<>
			<HugoMeetExperienceCanvas />
			<Project
				project={project}
				style={{
					position: "relative",
					padding: "5%",
					boxSizing: "border-box",
					height: "100vh",
					width: "60vw",
				}}
				moreButtonRedirection={"/redirects/hugomeet"}
				moreTextOverride={"Go to HugoMeet"}
				i18n
			/>
		</>
	);
}

export const revalidate = 60 * 60 * 24; /* each day */

// Tell nextjs to pre-render the pages where the dynamic params [locale] is "en" and "fr"
export async function generateStaticParams() {
	return [{ locale: "en" }, { locale: "fr" }];
}
