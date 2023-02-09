"use client";

// Libs
import Link from "next/link";

// Design
import Style from "./Stats.module.scss";

export interface IStatField {
	name: string;
	value: number;
	url: string;
	icon?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

export default function StatField(props: IStatField) {
	return (
		<Link
			prefetch={false}
			className={`a ${Style.StatField}`}
			href={props.url}
		>
			{props.icon && <div className={Style.StatIcon}>{props.icon}</div>}
			<span className={Style.StatValue}>
				{props.value.toLocaleString("en", { notation: "compact" })}
			</span>
			<span className={Style.StatName}>{props.name}</span>
		</Link>
	);
}
