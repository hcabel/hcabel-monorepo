import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Style from 'Styles/components/ProjectFirstImpression.module.scss';

import { IRouteGetProjectInfos, Locales } from '@hcabel/types/ProjectApi';

import GithubStats from 'Components/ProjectStats/GithubStats';
import VsCodeStats from 'Components/ProjectStats/VsCodeStats';
import YoutubeStats from 'Components/ProjectStats/YoutubeStats';

export interface IProjectFirstImpressionProps {
	id?: string;
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactElement[] | React.ReactElement;

	projectName: string;
	moreButtonRedirection?: string;
	moreTextOverride?: string;

	staticProps: IRouteGetProjectInfos;
}

export default function ProjectFirstImpression(props: IProjectFirstImpressionProps)
{
	const [_Project] = useState<IRouteGetProjectInfos>(props.staticProps);

	const { locale } = useRouter();

	return (
		<article id={props.id || ""} className={`${Style.ProjectFirstImpression} ${props.className || ""}`} style={props.style || {}}>
			<div>
				<figure className={Style.ProjectName} data-cy={`Project-${props.projectName}-Title`}>
					{_Project.name}
				</figure>
				<figcaption className={Style.ProjectDescription} data-cy={`Project-${props.projectName}-Description`}>
					{_Project.description[locale as Locales]}
				</figcaption>
				{props.moreButtonRedirection &&
					<Link href={props.moreButtonRedirection}>
						<a className={Style.ProjectMoreButton}>
							{props.moreTextOverride || "More details"}
						</a>
					</Link>
				}
			</div>
			<div className={Style.ProjectStats}>
				{_Project.stats["youtube"] &&
					<YoutubeStats stats={_Project.stats["youtube"]}/>
				}
				{_Project.stats["vscode marketplace"] &&
					<VsCodeStats stats={_Project.stats["vscode marketplace"]}/>
				}
				{_Project.stats["github"] &&
					<GithubStats stats={_Project.stats["github"]}/>
				}
			</div>
		</article>
	);
}