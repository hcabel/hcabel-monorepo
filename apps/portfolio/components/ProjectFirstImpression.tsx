
import Style from '@styles/components/ProjectFirstImpression.module.scss';
import GithubIcon from '@Images/Github/GithubIcon.svg';
import ForkIcon from '@Images/Github/ForkIcon.svg';
import StarIcon from '@Images/Github/StarIcon.svg';
import VsCodeIcon from '@Images/VsCodeIcon.svg';
import YoutubeIcon from '@Images/YoutubeIcon.svg';

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
			<div>
				<div className={Style.ProjectStats}>
					<div className={Style.StatContainer}>
						<YoutubeIcon />
						<div className={Style.StatValues}>
							<span>Views</span>
							<span className={Style.StatValue}>92.2k</span>
						</div>
					</div>
					<div className={Style.StatContainer}>
						<VsCodeIcon />
						<div className={Style.StatValues}>
							<div>
								<span className={Style.StatValue}>900</span>
								<span> installs</span>
							</div>
						</div>
					</div>
					<div className={Style.StatContainer}>
						<GithubIcon />
						<div className={Style.StatValues}>
							<div>
								<StarIcon className={Style.StatIcon} />
								<span className={Style.StatValue}>25</span>
								<span> stars</span>
							</div>
							<div>
								<ForkIcon className={Style.StatIcon} />
								<span className={Style.StatValue}>4</span>
								<span> forks</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
}