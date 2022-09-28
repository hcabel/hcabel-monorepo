import Style from '@styles/components/ProjectStats.module.scss';

import GithubIcon from '@Images/Github/GithubIcon.svg';
import ForkIcon from '@Images/Github/ForkIcon.svg';
import StarIcon from '@Images/Github/StarIcon.svg';

export interface IGithubStatsProps {
	stars?: number,
	forks?: number,
}

export default function GithubStats(props: IGithubStatsProps)
{
	const starsCount = props.stars?.toLocaleString("en", {notation: "compact"});
	const forksCount = props.forks?.toLocaleString("en", {notation: "compact"});

	return (
		<div className={Style.StatContainer}>
			<GithubIcon />
			<div className={Style.StatValues}>
				{starsCount &&
					<div>
						<StarIcon className={Style.StatIcon} />
						<span className={Style.StatValue}>{starsCount}</span>
						<span> stars</span>
					</div>
				}
				{forksCount &&
					<div>
						<ForkIcon className={Style.StatIcon} />
						<span className={Style.StatValue}>{forksCount}</span>
						<span> forks</span>
					</div>
				}
			</div>
		</div>
	);
}