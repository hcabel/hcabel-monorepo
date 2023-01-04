import { ReactElement } from "react";

import Style from "./BoxScroller.module.scss";

interface IBoxScrollerProps {
	children: ReactElement[];
	className?: string;
	useSnap?: boolean;
	vertical?: boolean;
	entryClassName?: string;
}

export default function BoxScroller(props: IBoxScrollerProps)
{

	return (
		<div
			className={`${props.vertical ? Style.ScrollerV : Style.ScrollerH} ${props.useSnap && Style.Snap} ${props.className}`}
		>
			{props.children.map((child, index) => {
				return (
					<div key={`BoxScroller-${index}`} className={`${Style.Element} ${props.entryClassName}`}>
						{child}
					</div>
				);
			})}
		</div>
	);
}