import Style from 'Styles/components/ProjectStats.module.scss';

import VsCodeIcon from 'Images/VsCodeIcon.svg';
import { IStat } from '@hcabel/types/ProjectApi';
import StatField from './StatField';

export interface IVsCodeStatsProps {
	stats: IStat[];
}

export default function VsCodeStats(props: IVsCodeStatsProps)
{
	return (
		<div className={Style.StatsContainer}>
			<VsCodeIcon />
			<div className={Style.Stats}>
				{props.stats.map((stat) => {
					return (
						<StatField
							key={`vscode-${stat.name}`}
							name={stat.name}
							value={stat.value}
							url={stat.url}
						/>
					);
				})}
			</div>
		</div>
	);
}