import Style from 'Styles/components/ProjectStats.module.scss';

import { IStat } from '@hcabel/types/ProjectApi';

import GithubIcon from 'Images/Github/GithubIcon.svg';
import ForkIcon from 'Images/Github/ForkIcon.svg';
import StarIcon from 'Images/Github/StarIcon.svg';
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
							key={`github-${stat.name}`}
							name={stat.name}
							value={stat.value}
							url={stat.url}
							icon={
								stat.name === "forks" ? <ForkIcon /> :
									stat.name === "stars" ? <StarIcon /> :
										undefined
							}
						/>
					);
				})}
			</div>
		</div>
	);
}