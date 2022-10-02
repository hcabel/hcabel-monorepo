import Style from 'Styles/components/ProjectFirstImpression.module.scss';

export interface IProjectFirstImpressionProps {
	id?: string;
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactElement[] | React.ReactElement;

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
			{props.children}
		</article>
	);
}