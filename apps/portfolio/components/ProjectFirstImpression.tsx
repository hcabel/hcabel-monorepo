import { useEffect, useState } from 'react';

import Style from 'Styles/components/ProjectFirstImpression.module.scss';

import { IRouteGetProjectInfos } from '@hcabel/types/ProjectApi';

import GithubStats from 'Components/ProjectStats/GithubStats';
import VsCodeStats from 'Components/ProjectStats/VsCodeStats';
import YoutubeStats from 'Components/ProjectStats/YoutubeStats';
import Link from 'next/link';

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

	return (
		<article id={props.id || ""} className={`${Style.ProjectFirstImpression} ${props.className || ""}`} style={props.style || {}}>
			<div>
				<figure className={Style.ProjectName} data-cy={`Project-${props.projectName}-Title`}>
					{_Project.name}
				</figure>
				<figcaption className={Style.ProjectDescription} data-cy={`Project-${props.projectName}-Description`}>
					{_Project.description}
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