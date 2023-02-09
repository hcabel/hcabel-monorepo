"use client";

// External project
import { Types as ProjectApiTypes } from "@hcabel/bridges/ProjectApi";

// Design
import Style from "./Stats.module.scss";
import VsCodeIcon from "Images/VsCodeIcon.svg";

// Components
import StatField from "./StatField";

// Hooks
import { useLocale } from "App/[locale]/LocaleContext";

export interface IVsCodeStatsProps {
	stats: ProjectApiTypes.IStat[];
}

export default function VsCodeStats(props: IVsCodeStatsProps) {
	const { locale } = useLocale();
	return (
		<div className={Style.StatsContainer}>
			<VsCodeIcon />
			<div className={Style.Stats}>
				{props.stats.map((stat) => {
					return (
						<StatField
							key={`vscode-${stat.name.en}`}
							name={stat.name[locale]}
							value={stat.value}
							url={stat.url}
						/>
					);
				})}
			</div>
		</div>
	);
}
