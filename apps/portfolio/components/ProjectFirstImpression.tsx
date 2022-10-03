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
				<a href="https://www.youtube.com/watch?v=_usDZ6osnR4">
					<YoutubeStats
						views={_Project.stats
							.filter((stat) => {
								return stat.platform === "youtube";
							})
							.reduce((acc, stat) => {
								return acc + (stat.name === "views" ? stat.value : 0);
							}, 0)
						}
					/>
				</a>
				<a href="https://marketplace.visualstudio.com/items?itemName=HugoCabel.uvch">
					<VsCodeStats name="HugoCabel.uvch"/>
				</a>
				<a href="https://github.com/hcabel/UnrealVsCodeHelper">
					<GithubStats repoUrl="https://github.com/hcabel/UnrealVsCodeHelper" />
				</a>
			</div>
		</article>
	);
}