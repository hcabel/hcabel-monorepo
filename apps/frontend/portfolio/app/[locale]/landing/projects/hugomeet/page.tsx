import Project from "App/[locale]/landing/(elements)/project/Projects";
import { Routes as ProjectApiRoutes } from "@hcabel/bridges/ProjectApi";

import HugoMeetExperienceCanvas from "./HugoMeetExperienceCanvas";

export default async function ProjectsPage() {
	const project = await ProjectApiRoutes.get_single_project("6338ffeb5e00275fb5051c9e");
	return (
		<>
			<HugoMeetExperienceCanvas />
			<Project
				project={project}
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
