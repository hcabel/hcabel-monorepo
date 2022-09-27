
import Style from '@styles/components/ProjectFirstImpression.module.scss';

import VsCodeIcon from '@Images/VsCodeIcon.svg';
import GithubStats from '@Components/ProjectStats/GithubStats';
import YoutubeStats from './ProjectStats/YoutubeStats';

export interface IProjectFirstImpressionProps {
	id?: string;
	className?: string;
	style?: React.CSSProperties;

	projectName: string;
	projectDescription: string;
	onMoreClicked?: () => void;
}

export default function ProjectFirstImpression(props: IProjectFirstImpressionProps)
{
	return (
		<article id={props.id || ""} className={`${Style.ProjectFirstImpression} ${props.className || ""}`} style={props.style || {}}>
			<div>
				<figure className={Style.ProjectName}>
					{props.projectName}
				</figure>
				<figcaption className={Style.ProjectDescription}>
					{props.projectDescription}
				</figcaption>
				{props.onMoreClicked &&
					<a className={Style.ProjectMoreButton} onClick={props.onMoreClicked}>
						More details
					</a>
				}
			</div>
			<div className={Style.ProjectStats}>
				<YoutubeStats />
				<div className={Style.StatContainer}>
					<VsCodeIcon />
					<div className={Style.StatValues}>
						<div>
							<span className={Style.StatValue}>900</span>
							<span> installs</span>
						</div>
					</div>
				</div>
				<GithubStats />
				</div>
		</article>
	);
}