import { useRouter } from 'next/router';

import Style from 'Styles/components/ProjectStats.module.scss';

import { IStat, Locales } from '@hcabel/types/ProjectApi';

import VsCodeIcon from 'Images/VsCodeIcon.svg';
import StatField from './StatField';

export interface IVsCodeStatsProps {
	stats: IStat[];
}

export default function VsCodeStats(props: IVsCodeStatsProps)
{
	const { locale } = useRouter();

	return (
		<div className={Style.StatsContainer}>
			<VsCodeIcon />
			<div className={Style.Stats}>
				{props.stats.map((stat) => {
					return (
						<StatField
							key={`vscode-${stat.name.en}`}
							name={stat.name[locale as Locales]}
							value={stat.value}
							url={stat.url}
						/>
					);
				})}
			</div>
		</div>
	);
}