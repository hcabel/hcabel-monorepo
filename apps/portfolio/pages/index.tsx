import { useEffect } from 'react';

import Style from 'Styles/pages/index.module.scss';

import Canvas3D from '3D/Canvas3D';
import ProjectFirstImpression from 'Components/ProjectFirstImpression';

export function Index() {
	useEffect(() => {
		new Canvas3D(document.getElementById("Canvas3D") as HTMLCanvasElement);
	}, []);

	return (
		<section className="Page">
			<canvas id="Canvas3D" className={Style.ThreeJsCanvas3D}></canvas>
			<main id="HtmlGridContent" className={Style.HtmlPageContent}>
				{/* UNREAL VSCODE HELPER */}
				<ProjectFirstImpression
					className={Style.ProjectUVCH}
					projectName="Unreal VsCode Helper"
				/>
				{/* HUGO MEET */}
				<ProjectFirstImpression
					className={Style.ProjectHugoMeet}
					projectName="HugoMeet"
					moreButtonRedirection={"/projects/hugomeet"}
					moreTextOverride="Explore HugoMeet"
				/>
				{/* PROCEDURAL TERRAIN */}
				<ProjectFirstImpression
					className={Style.ProjectProceduralTerrain}
					projectName="Procedural Terrain"
				/>
			</main>
		</section>
	);
}

export default Index;
