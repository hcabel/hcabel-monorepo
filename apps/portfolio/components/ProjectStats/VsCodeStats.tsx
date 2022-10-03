import Style from 'Styles/components/ProjectStats.module.scss';

import VsCodeIcon from 'Images/VsCodeIcon.svg';

export interface IVsCodeStatsProps {
	installs: number;
}

export default function VsCodeStats(props: IVsCodeStatsProps)
{

	return (
		<div className={Style.StatContainer}>
			<VsCodeIcon />
			<div className={Style.StatValues}>
				<div>
					<span className={Style.StatValue}>
						{props.installs.toLocaleString("en", {notation: "compact"})}
					</span>
					<span> installs</span>
				</div>
			</div>
		</div>
	);
}