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

export interface GithubActivities {
	data: {
		user: {
			name: string;
			contributionsCollection: {
				contributionCalendar: {
					totalContributions: number;
					weeks: {
						contributionDays: {
							color: `#${string}`;
							contributionCount: number;
							date: string;
							weekday: number;
						}[];
						firstDay: string;
					}[];
				};
			}
		}
	}
}


async function getContributions(username: string, options?: RequestInit): Promise<GithubActivities> {
	const headers = {
		'Authorization': `bearer ${process.env.NX_GITHUB_TOKEN}`,
	}
	const body = {
		"query": `query {
			user(login: "${username}") {
				name
				contributionsCollection {
					contributionCalendar {
						totalContributions
						weeks {
							contributionDays {
								color
								contributionCount
								date
								weekday
							}
							firstDay
						}
					}
				}
			}
		}`
	}
	const response = await fetch('https://api.github.com/graphql', { method: 'POST', body: JSON.stringify(body), headers: headers })
	const data = await response.json()
	return data
}

export default async function LandingPage(props: any)
{
	const projects = await GetProjectsData({
		next: {
			// Revalidate every 24h (that when my script are updating the projects DB)
			revalidate: 60 * 60 * 24,
		}
	});
	const activities = await getContributions(`hcabel`, {
		next: {
			// Revalidate every 24h (mostly for design purpose, so no need to be too accurate)
			revalidate: 60 * 60 * 24,
		}
	})

	// I had to wrap the content in a component to be able to fecth projects data on the server side
	return (
		<LandingPageContent
			projects={projects}
			activities={activities}
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
