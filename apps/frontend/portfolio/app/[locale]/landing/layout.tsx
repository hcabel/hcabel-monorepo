import { ILocaleLayoutProps } from "../layout";

import ProjectScrollBar from "./(elements)/ProjectScrollBar";

export default function Layout(props: ILocaleLayoutProps) {
	return (
		<div className="Page">
			<ProjectScrollBar>{props.children}</ProjectScrollBar>
		</div>
	);
}
