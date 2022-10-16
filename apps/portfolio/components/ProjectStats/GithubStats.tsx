import { useRouter } from 'next/router';

import Style from 'Styles/components/ProjectStats.module.scss';

import { IStat, Locales } from '@hcabel/types/ProjectApi';

import GithubIcon from 'Images/github/GithubIcon.svg';
import ForkIcon from 'Images/github/ForkIcon.svg';
import StarIcon from 'Images/github/StarIcon.svg';
import StatField from './StatField';

export interface IGithubStatsProps {
	stats: IStat[];
}

export default function GithubStats(props: IGithubStatsProps)
{
	const { locale } = useRouter();

	return (
		<div className={Style.StatsContainer}>
			<GithubIcon />
			<div className={Style.Stats}>
				{props.stats.map((stat) => {
					return (
						<StatField
							key={`github-${stat.name.en}`}
							name={stat.name[locale as Locales]}
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