import { IRouteGetAllProjects, IRouteGetProjectById } from "@hcabel/types/ProjectApi";
import LandingPageContent from "./(clients)/LandingPageContent";

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

	// UTC Date 365 days ago rounded to the start of the day
	const date365DaysAgose = new Date(
		new Date().setUTCDate(new Date().getUTCDate() - 365)
	);
	date365DaysAgose.setUTCHours(0, 0, 0, 0);

	const body = {
		"query": `query {
			user(login: "${username}") {
				name
				contributionsCollection(from: "${date365DaysAgose.toJSON()}", to: "${new Date().toJSON()}") {
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

// This component is the landing page where data are fetched
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
			// Revalidate every 6h (It is mainly for design purposes and ther is no point to be very accurate)
			// TODO: Revalidate on demande every day, there is a time frame where a new day has come but the revalidate timeout is not finished
			// so the red cube (how show the current day) does not appear.
			revalidate: 60 * 60 * 6,
		}
	})

	return (
		<LandingPageContent
			projects={projects}
			activities={activities}
			locale={props.params.locale}
		/>
	);
}

// Tell nextjs to pre-render the pages where the dynamic params [locale] is "en" and "fr"
export async function generateStaticParams()
{
	return ([
		{ locale: "en" },
		{ locale: "fr" },
	]);
}
