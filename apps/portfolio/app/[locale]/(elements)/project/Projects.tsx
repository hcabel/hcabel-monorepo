"use client";

// Libs
import Link from 'next/link';

// External project
import { IRouteGetProjectById } from '@hcabel/types/ProjectApi';

// Design
import Style from './project.module.scss';

// Components
import GithubStats from './GithubStats';
import VsCodeStats from './VsCodeStats';
import YoutubeStats from './YoutubeStats';

export interface IProjectProps {
	id?: string;
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactElement[] | React.ReactElement;

	moreButtonRedirection?: string;
	moreTextOverride?: string;

	project: IRouteGetProjectById;

	hideDescription?: boolean;
	hideStats?: boolean;
}

export default function Project(props: IProjectProps)
{
	if (!props.project || Object.keys(props.project).length === 0) {
		return null;
	}
	return (
		<article id={props.id || ""} className={`${Style.ProjectContainer} ${props.className || ""}`} style={props.style || {}}>
			<div>
				<h1 className={`h1 ${Style.ProjectName}`} data-cy={`Project-${props.project.name}-Title`}>
					{props.project.name}
				</h1>
				{!props.hideDescription &&
					<h4 className={`h4 ${Style.ProjectDescription}`} data-cy={`Project-${props.project.name}-Description`}>
						{props.project.description["en"]}
					</h4>
				}
				{props.moreButtonRedirection &&
					<Link className={Style.ProjectMoreButton} href={props.moreButtonRedirection}>
						{props.moreTextOverride || "More details"}
					</Link>
				}
			</div>
			{!props.hideStats &&
				<div className={Style.ProjectStats}>
					{props.project.stats["youtube"] &&
						<YoutubeStats stats={props.project.stats["youtube"]}/>
					}
					{props.project.stats["vscode marketplace"] &&
						<VsCodeStats stats={props.project.stats["vscode marketplace"]}/>
					}
					{props.project.stats["github"] &&
						<GithubStats stats={props.project.stats["github"]}/>
					}
				</div>
			}
		</article>
	);
}