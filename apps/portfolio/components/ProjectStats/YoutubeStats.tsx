import Style from "@styles/components/ProjectStats.module.scss";

import YoutubeIcon from '@Images/YoutubeIcon.svg';

export interface IYoutubeStatsProps {
	views: number;
}

export default function YoutubeStats(props: IYoutubeStatsProps)
{
	const viewsCount = props.views.toLocaleString("en", {notation: "compact"});

	return (
		<div className={Style.StatContainer}>
			<YoutubeIcon />
			<div className={Style.StatValues}>
				<span>Views</span>
				<span className={Style.StatValue}>{viewsCount}</span>
			</div>
		</div>
	);
}