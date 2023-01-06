import { ILocaleLayoutProps } from "../layout";

import ProjectsInfos from "./getProjectsInfos";
import Scroller from "./(elements)/Scroller";

export default function Layout(props: ILocaleLayoutProps)
{
	return (
		<div className="Page">
			<Scroller projectInfo={ProjectsInfos} locale={props.params.locale}>
				{props.children}
			</Scroller>
		</div>
	);
}