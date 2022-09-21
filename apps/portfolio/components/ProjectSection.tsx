import Style from "@styles/components/ProjectSection.module.scss";

export interface IProjectSectionProps {
	className?: string;
	style?: React.CSSProperties;
	children?: React.ReactNode;
	title: string;
}

export default function ProjectSection(props: IProjectSectionProps)
{

	return (
		<section className={`${Style.Window} ${props.className || ""}`} style={props.style}>
			<header className={Style.WindowHeader}>
				<div className={`${Style.WindowButton} ${Style.CloseButton}`}></div>
				<div className={`${Style.WindowButton} ${Style.MinimiseButton}`}></div>
				<div className={`${Style.WindowButton} ${Style.FullscreenButton}`}></div>
				<h1 className={Style.WindowTitle}>{props.title}</h1>
			</header>
			<div className={Style.WindowContent}>
				{props.children}
			</div>
		</section>
	);
}