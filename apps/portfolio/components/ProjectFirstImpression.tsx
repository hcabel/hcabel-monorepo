import { useEffect, useState } from 'react';

import Style from 'Styles/components/ProjectFirstImpression.module.scss';

import { IGetProjectInfos } from '@hcabel/types/ProjectApi';

import GithubStats from 'Components/ProjectStats/GithubStats';
import VsCodeStats from 'Components/ProjectStats/VsCodeStats';
import YoutubeStats from 'Components/ProjectStats/YoutubeStats';

export interface IProjectFirstImpressionProps {
	id?: string;
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactElement[] | React.ReactElement;

	projectName: string;
	onMoreClicked?: () => void;
}

export default function ProjectFirstImpression(props: IProjectFirstImpressionProps)
{
	const [_Project, set_Project] = useState<IGetProjectInfos | undefined>(undefined);

	// @TODO: Convert stats from array to hash table (with platform as key)
	const githubStats = _Project?.stats.filter((stat) => stat.platform === "github") || [];
	const youtubeStats = _Project?.stats.filter((stat) => stat.platform === "youtube") || [];
	const vscodeStats = _Project?.stats.filter((stat) => stat.platform === "vscode marketplace") || [];

	useEffect(() => {
		fetch(`api/projects/${props.projectName}`)
			.then((response) => response.json())
			.then((data: IGetProjectInfos) => set_Project(data));
	}, [ props.projectName ]);

	// If we dont have the project infos, we dont render anything
	// @TODO: Implement Client Side Rendering
	if (!_Project) {
		return null;
	}
	return (
		<article id={props.id || ""} className={`${Style.ProjectFirstImpression} ${props.className || ""}`} style={props.style || {}}>
			<div>
				<figure className={Style.ProjectName} data-cy={`Project-${props.projectName}-Title`}>
					{_Project.name}
				</figure>
				<figcaption className={Style.ProjectDescription} data-cy={`Project-${props.projectName}-Description`}>
					{_Project.description}
				</figcaption>
				{props.onMoreClicked &&
					<a className={Style.ProjectMoreButton} onClick={props.onMoreClicked}>
						More details
					</a>
				}
			</div>
			<div className={Style.ProjectStats}>
				{youtubeStats.length > 0 &&
					<YoutubeStats stats={youtubeStats}/>
				}
				{vscodeStats.length > 0 &&
					<VsCodeStats stats={vscodeStats}/>
				}
				{githubStats.length > 0 &&
					<GithubStats stats={githubStats}/>
				}
			</div>
		</article>
	);
}