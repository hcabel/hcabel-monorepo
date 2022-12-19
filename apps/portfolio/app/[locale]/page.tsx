import { IRouteGetAllProjects, IRouteGetProjectById } from "@hcabel/types/ProjectApi";
import LandingPageContent from "./(elements)/LandingPageContent";

export interface IProjectDatas {
	[projectName: string]: IRouteGetProjectById
}

async function GetProjectsData(options?: RequestInit)
{
	const projectDatas: IProjectDatas = {};

	// Get all projects
	const projectsList = await fetch(`${process.env.NX_PROJECT_API_ENDPOINT}/projects`, options)
		.then((res) => res.json() as Promise<IRouteGetAllProjects>);

	// Get all the data of each project
	for (const project of projectsList) {
		projectDatas[project.name] = await fetch(`${process.env.NX_PROJECT_API_ENDPOINT}/projects/${project._id}`, options)
			.then((res) => res.json() as Promise<IRouteGetProjectById>);
	}

	return (projectDatas);
}

export default async function LandingPage(props: any)
{
	const projects = await GetProjectsData({
		next: {
			// Revalidate every 24h (that when my script are updating the projects DB)
			revalidate: 60 * 60 * 24,
		}
	});

	// I had to wrap the content in a component to be able to fecth projects data on the server side
	return (
		<LandingPageContent
			projects={projects}
			locale={props.params.locale}
		/>
	);
}

export async function generateStaticParams()
{
	return ([
		{ locale: "en" },
		{ locale: "fr" },
	]);
}
