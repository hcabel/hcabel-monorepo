import Style from '@styles/pages/index.module.scss';
import { useEffect } from 'react';

import Canvas3D from '@3D/Canvas3D';
import ProjectSection from '@Components/ProjectSection';

export function Index() {

	useEffect(() => {
		new Canvas3D(document.getElementById('Canvas3D') as HTMLCanvasElement);
	}, [])

	return (
		<div className="Page">
			<canvas id="Canvas3D" className={Style.ThreeJsCanvas3D}>
			</canvas>
			<main className={Style.HtmlPageContent}>
				<ProjectSection
					className={Style.ProjectUVCHDescription}
					title="Unreal VsCode Helper"
				/>
				<ProjectSection
					className={Style.ProjectHugoMeetDescription}
					title="HugoMeet"
				/>
				<ProjectSection
					className={Style.ProjectProceTerrainDescription}
					title="Procedural Terrain Generator"
				/>
			</main>
		</div>
	);
}

export default Index;
