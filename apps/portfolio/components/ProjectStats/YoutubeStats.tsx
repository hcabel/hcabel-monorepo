import { useRouter } from 'next/router';

import Style from 'Styles/components/ProjectStats.module.scss';

import YoutubeIcon from 'Images/YoutubeIcon.svg';
import { IStat, Locales } from '@hcabel/types/ProjectApi';
import StatField from './StatField';

export interface IYoutubeStatsProps {
	stats: IStat[];
}

export default function YoutubeStats(props: IYoutubeStatsProps)
{
	const { locale } = useRouter();

	return (
		<div className={Style.StatsContainer}>
			<YoutubeIcon />
			<div className={Style.Stats}>
				{props.stats.map((stat) => {
					return (
						<StatField
							key={`youtube-${stat.name.en}`}
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