import Style from 'Styles/components/ProjectStats.module.scss';

import YoutubeIcon from 'Images/YoutubeIcon.svg';
import { IStat } from '@hcabel/types/ProjectApi';
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
						<StatField key={`youtube-${stat.name}`} name={stat.name} value={stat.value} />
					);
				})}
			</div>
		</div>
	);
}