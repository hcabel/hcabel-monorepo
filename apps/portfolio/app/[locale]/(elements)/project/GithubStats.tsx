"use client";

// External project
import { IStat } from '@hcabel/types/ProjectApi';

// Design
import Style from './Stats.module.scss';
import GithubIcon from 'Images/github/GithubIcon.svg';
import ForkIcon from 'Images/github/ForkIcon.svg';
import StarIcon from 'Images/github/StarIcon.svg';

// Components
import StatField from './StatField';

export interface IGithubStatsProps {
	stats: IStat[];
}

export default function GithubStats(props: IGithubStatsProps)
{
	return (
		<div className={Style.StatsContainer}>
			<GithubIcon />
			<div className={Style.Stats}>
				{props.stats.map((stat) => {
					return (
						<StatField
							key={`github-${stat.name.en}`}
							name={stat.name["en"]}
							value={stat.value}
							url={stat.url}
							icon={
								stat.name.en === "forks" ? <ForkIcon /> :
									stat.name.en === "stars" ? <StarIcon /> :
										undefined
							}
						/>
					);
				})}
			</div>
		</div>
	);
}