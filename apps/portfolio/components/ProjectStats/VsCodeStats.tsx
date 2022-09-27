import Style from '@styles/components/ProjectStats.module.scss';

import VsCodeIcon from '@Images/VsCodeIcon.svg';

export default function VsCodeStats()
{

	return (
		<div className={Style.StatContainer}>
			<VsCodeIcon />
			<div className={Style.StatValues}>
				<div>
					<span className={Style.StatValue}>900</span>
					<span> installs</span>
				</div>
			</div>
		</div>
	);
}