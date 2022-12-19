"use client";

// External project
import { IStat, Locales } from '@hcabel/types/ProjectApi';

// Design
import Style from './Stats.module.scss';
import VsCodeIcon from 'Images/VsCodeIcon.svg';

// Components
import StatField from './StatField';

export interface IVsCodeStatsProps {
	stats: IStat[];
	locale: Locales;
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
							key={`vscode-${stat.name.en}`}
							name={stat.name[props.locale]}
							value={stat.value}
							url={stat.url}
						/>
					);
				})}
			</div>
		</div>
	);
}