import Style from '@styles/components/ProjectStats.module.scss';

import GithubIcon from '@Images/Github/GithubIcon.svg';
import ForkIcon from '@Images/Github/ForkIcon.svg';
import StarIcon from '@Images/Github/StarIcon.svg';

export default function GithubStats()
{

	return (
		<div className={Style.StatContainer}>
			<GithubIcon />
			<div className={Style.StatValues}>
				<div>
					<StarIcon className={Style.StatIcon} />
					<span className={Style.StatValue}>25</span>
					<span> stars</span>
				</div>
				<div>
					<ForkIcon className={Style.StatIcon} />
					<span className={Style.StatValue}>4</span>
					<span> forks</span>
				</div>
			</div>
		</div>
	);
}