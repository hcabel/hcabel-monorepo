import Link from "next/link";
import { ILocaleLayoutProps } from "../layout";

import Style from "./page.module.scss";
import ArrowIcon from 'Images/arrow.svg';
import { I18nDictText } from "Components/i18nText";
import IntroExperienceCanvas from "./(elements)/IntroExperienceCanvas";

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


async function getGithubContributions(username: string): Promise<GithubActivities> {
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
	const response = await fetch('https://api.github.com/graphql', { method: 'POST', body: JSON.stringify(body), headers: headers });
	return (await response.json());
}

export default async function LandingPage(props: ILocaleLayoutProps)
{
	const githubActivities = await getGithubContributions("hcabel");

	if (!githubActivities) {
		return (null);
	}
	return (
		<>
			<IntroExperienceCanvas
				Activities={githubActivities}
			/>
			<div className={`Page ${Style.Landing}`}>
				<div className={Style.Description}>
					<h1 className={`h1 ${Style.Name}`} data-cy="my-real-name">Hugo Cabel</h1>
					<h2 className={`h4 ${Style.Job}`} data-cy="my-job">
						<I18nDictText i18nKey="MyJob" />
					</h2>
				</div>
				<Link className={Style.Freelance} href={`/${props.params.locale}/freelance`}>
					<h3 className={`h5 ${Style.FreelanceText}`}>{"Freelance"}</h3>
				</Link>
				<div className={Style.MyProject}>
					<ArrowIcon />
					<h4 className={`h4 ${Style.MyProjectText}`}>
						<I18nDictText i18nKey="MyProjects-Title" />
					</h4>
					<ArrowIcon />
				</div>
			</div>
		</>
	)
}

// Tell nextjs to pre-render the pages where the dynamic params [locale] is "en" and "fr"
export async function generateStaticParams()
{
	return ([
		{ locale: "en" },
		{ locale: "fr" }
	]);
}

export const revalidate = 60 * 60 * 24; /* each day */