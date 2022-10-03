import { useEffect, useState } from 'react';

import Style from 'Styles/components/ProjectFirstImpression.module.scss';

import { IGetProjectInfos, IStatModel } from '@hcabel/types/ProjectApi';

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

	const YoutubeViews = (_Project ? ReduceStats(_Project.stats, "youtube", "views") : undefined);
	const VsCodeInstalls = (_Project ? ReduceStats(_Project.stats, "vscode marketplace", "installs") : undefined);
	const GithubStars = (_Project ? ReduceStats(_Project.stats, "github", "stars") : undefined);
	const GithubForks = (_Project ? ReduceStats(_Project.stats, "github", "forks") : undefined);

	function	ReduceStats(stats: IStatModel[], platform: string, name: string)
	{
		const statOfName = stats.filter((stat) => stat.platform === platform && stat.name === name);
		if (statOfName.length === 0) {
			return (undefined);
		}
		return (statOfName.reduce((acc, stat) => acc + stat.value, 0));
	}

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
				{YoutubeViews &&
					<a href="https://www.youtube.com/watch?v=_usDZ6osnR4">
						<YoutubeStats
							views={YoutubeViews}
						/>
					</a>
				}
				{VsCodeInstalls &&
					<a href="https://marketplace.visualstudio.com/items?itemName=HugoCabel.uvch">
						<VsCodeStats installs={VsCodeInstalls} />
					</a>
				}
				{(GithubStars || GithubForks) &&
					<a href="https://github.com/hcabel/UnrealVsCodeHelper">
						<GithubStats stars={GithubStars} forks={GithubForks} />
					</a>
				}
			</div>
		</article>
	);
}