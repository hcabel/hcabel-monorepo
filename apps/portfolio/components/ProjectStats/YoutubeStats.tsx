import Style from "@styles/components/ProjectStats.module.scss";

import YoutubeIcon from '@Images/YoutubeIcon.svg';

export default function YoutubeStats()
{
	return (
		<div className={Style.StatContainer}>
			<YoutubeIcon />
			<div className={Style.StatValues}>
				<span>Views</span>
				<span className={Style.StatValue}>92.2k</span>
			</div>
		</div>
	)
}