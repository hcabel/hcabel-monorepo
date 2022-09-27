import Style from '@styles/pages/index.module.scss';
import { useEffect } from 'react';

import Canvas3D from '@3D/Canvas3D';
import ProjectFirstImpression from '@Components/ProjectFirstImpression';

export function Index() {

	useEffect(() => {
		new Canvas3D(document.getElementById('Canvas3D') as HTMLCanvasElement);
	}, [])

	return (
		<section className="Page">
			<canvas id="Canvas3D" className={Style.ThreeJsCanvas3D}></canvas>
			<main id="HtmlGridContent" className={Style.HtmlPageContent}>
				<ProjectFirstImpression
					className={Style.ProjectUVCH}
					projectName="Unreal VsCode Helper"
					projectDescription="is a VSCode extension that provides a set of tools to help you develop Unreal Engine projects inside VsCode."
				/>
				<ProjectFirstImpression
					className={Style.ProjectHugoMeet}
					projectName="Hugo Meet"
					projectDescription="is a video meeting platform, that I made to learn how to use WebRTC and video/audio streaming."
					/>
				<ProjectFirstImpression
					className={Style.ProjectProceduralTerrain}
					projectName="Procedural Terrain"
					projectDescription="is a video meeting platform, that I made to learn how to use WebRTC and video/audio streaming."
				/>
			</main>
		</section>
	);
}

export default Index;
