"use client";

// External project
import { IStat } from '@hcabel/types/ProjectApi';

// Design
import Style from './Stats.module.scss';
import YoutubeIcon from 'Images/YoutubeIcon.svg';

// Components
import StatField from './StatField';

export interface IYoutubeStatsProps {
	stats: IStat[];
}

export default function YoutubeStats(props: IYoutubeStatsProps)
{
	return (
		<div className={Style.StatsContainer}>
			<YoutubeIcon />
			<div className={Style.Stats}>
				{props.stats.map((stat) => {
					return (
						<StatField
							key={`youtube-${stat.name.en}`}
							name={stat.name["en"]}
							value={stat.value}
							url={stat.url}
						/>
					);
				})}
			</div>
		</div>
	);
}