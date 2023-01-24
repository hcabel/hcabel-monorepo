"use client";

// External project
import { Types as ProjectApiTypes } from "@hcabel/bridges/ProjectApi";

// Design
import Style from "./Stats.module.scss";
import GithubIcon from "Images/github/GithubIcon.svg";
import ForkIcon from "Images/github/ForkIcon.svg";
import StarIcon from "Images/github/StarIcon.svg";

// Components
import StatField from "./StatField";

// Hooks
import { useLocale } from "App/[locale]/LocaleContext";

export interface IGithubStatsProps {
	stats: ProjectApiTypes.IStat[];
}

export default function GithubStats(props: IGithubStatsProps) {
	const { locale } = useLocale();

	return (
		<div className={Style.StatsContainer}>
			<GithubIcon />
			<div className={Style.Stats}>
				{props.stats.map((stat) => {
					return (
						<StatField
							key={`github-${stat.name.en}`}
							name={stat.name[locale]}
							value={stat.value}
							url={stat.url}
							icon={
								stat.name.en === "forks" ? (
									<ForkIcon />
								) : stat.name.en === "stars" ? (
									<StarIcon />
								) : undefined
							}
						/>
					);
				})}
			</div>
		</div>
	);
}
