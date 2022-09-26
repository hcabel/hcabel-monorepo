
export interface IProjectFirstImpressionProps {
	id?: string;
	className?: string;
	style?: React.CSSProperties;

	projectName: string;
	projectDescription: string;
	onMoreClicked: () => void;
}

export default function ProjectFirstImpression(props: IProjectFirstImpressionProps)
{
	return (
		<article id={props.id || ""} className={props.className || ""} style={props.style || {}}>
			<figure>{props.projectName}</figure>
			<figcaption>{props.projectDescription}</figcaption>
			<a onClick={props.onMoreClicked}>More details</a>
		</article>
	);
}