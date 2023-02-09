"use client";

// External project
import { Types as ProjectApiTypes } from "@hcabel/bridges/ProjectApi";

// Design
import Style from "./Stats.module.scss";
import YoutubeIcon from "Images/YoutubeIcon.svg";

// Components
import StatField from "./StatField";

// Hooks
import { useLocale } from "App/[locale]/LocaleContext";

export interface IYoutubeStatsProps {
	stats: ProjectApiTypes.IStat[];
}

export default function YoutubeStats(props: IYoutubeStatsProps) {
	const { locale } = useLocale();

	return (
		<div className={Style.StatsContainer}>
			<YoutubeIcon />
			<div className={Style.Stats}>
				{props.stats.map((stat) => {
					return (
						<StatField
							key={`youtube-${stat.name.en}`}
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
