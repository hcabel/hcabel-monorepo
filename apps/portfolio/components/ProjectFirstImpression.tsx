
import Style from '@styles/components/ProjectFirstImpression.module.scss';

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
		<article id={props.id || ""} className={props.className || ""} style={props.style || {}}>
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
		</article>
	);
}