import Style from '@styles/components/ProjectStats.module.scss';

import VsCodeIcon from '@Images/VsCodeIcon.svg';


export interface IVsCodeStatsProps {
	installs: number;
}

export default function VsCodeStats(props: IVsCodeStatsProps)
{
	const installsCount = props.installs.toLocaleString("en", {notation: "compact"});

	return (
		<div className={Style.StatContainer}>
			<VsCodeIcon />
			<div className={Style.StatValues}>
				<div>
					<span className={Style.StatValue}>{installsCount}</span>
					<span> installs</span>
				</div>
			</div>
		</div>
	);
}