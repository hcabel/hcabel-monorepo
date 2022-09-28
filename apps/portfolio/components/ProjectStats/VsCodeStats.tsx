import Style from '@styles/components/ProjectStats.module.scss';

import VsCodeIcon from '@Images/VsCodeIcon.svg';
import { useEffect, useState } from 'react';


export interface IVsCodeStatsProps {
	name: string;
}

export default function VsCodeStats(props: IVsCodeStatsProps)
{
	const [_InstallsCount, set_InstallsCount] = useState(0);

	useEffect(() => {
		const init = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json;api-version=3.0-preview.1",
				"Accept-Encoding": "gzip"
			},
			// check https://github.com/microsoft/vscode/tree/main/src/vs/platform/extensionManagement/common/extensionGalleryService.ts
			// for details about the request body
			body: JSON.stringify({
				filters: [{
					criteria: [{
						filterType: 7, // ExtensionName
						value: props.name
					}]
				}],
				flags: 0x100 // get stats only
			})
		};

		fetch("https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery", init)
			.then((response) => response.json())
			.then((data) => {
				return (data?.results[0]?.extensions[0] || undefined);
			})
			.then((extension) => {
				if (extension) {
					const installsCount = extension.statistics[0].value.toLocaleString("en", {notation: "compact"});
					set_InstallsCount(installsCount);
				}
			});
	}, []);

	return (
		<div className={Style.StatContainer}>
			<VsCodeIcon />
			<div className={Style.StatValues}>
				<div>
					<span className={Style.StatValue}>
						{_InstallsCount.toLocaleString("en", {notation: "compact"})}
					</span>
					<span> installs</span>
				</div>
			</div>
		</div>
	);
}