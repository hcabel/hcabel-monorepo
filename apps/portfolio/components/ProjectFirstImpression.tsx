import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Style from 'Styles/components/ProjectFirstImpression.module.scss';

import { IRouteGetProjectById, Locales } from '@hcabel/types/ProjectApi';

import GithubStats from 'Components/ProjectStats/GithubStats';
import VsCodeStats from 'Components/ProjectStats/VsCodeStats';
import YoutubeStats from 'Components/ProjectStats/YoutubeStats';

export interface IProjectFirstImpressionProps {
	id?: string;
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactElement[] | React.ReactElement;

	moreButtonRedirection?: string;
	moreTextOverride?: string;

	staticProps: IRouteGetProjectById;

	hideDescription?: boolean;
	hideStats?: boolean;
}

export default function ProjectFirstImpression(props: IProjectFirstImpressionProps)
{
	const [_Project] = useState<IRouteGetProjectById>(props.staticProps);

	const { locale } = useRouter();

	return (
		<article id={props.id || ""} className={`${Style.ProjectFirstImpression} ${props.className || ""}`} style={props.style || {}}>
			<div>
				<h1 className={Style.ProjectName} data-cy={`Project-${props.staticProps.name}-Title`}>
					{_Project.name}
				</h1>
				{!props.hideDescription &&
					<h3 className={Style.ProjectDescription} data-cy={`Project-${props.staticProps.name}-Description`}>
						{_Project.description[locale as Locales]}
					</h3>
				}
				{props.moreButtonRedirection &&
					<Link href={props.moreButtonRedirection}>
						<a className={Style.ProjectMoreButton}>
							{props.moreTextOverride || "More details"}
						</a>
					</Link>
				}
			</div>
			{!props.hideStats &&
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
			}
		</article>
	);
}