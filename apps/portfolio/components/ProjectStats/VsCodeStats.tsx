import Style from 'Styles/components/ProjectStats.module.scss';

import VsCodeIcon from 'Images/VsCodeIcon.svg';
import { IStatModel } from '@hcabel/types/ProjectApi';
import StatField from './StatField';

export interface IVsCodeStatsProps {
	stats: IStatModel[];
}

export default function VsCodeStats(props: IVsCodeStatsProps)
{
	return (
		<div className={Style.StatsContainer}>
			<VsCodeIcon />
			<div className={Style.Stats}>
				{props.stats.map((stat) => {
					return (
						<StatField key={`${stat.platform}-${stat.name}`} name={stat.name} value={stat.value} />
					);
				})}
			</div>
		</div>
	);
}