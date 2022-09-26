import Style from '@styles/pages/index.module.scss';
import { useEffect } from 'react';

import Canvas3D from '@3D/Canvas3D';
import ProjectFirstImpression from '@Components/ProjectFirstImpression';

export function Index() {

	useEffect(() => {
		new Canvas3D(document.getElementById('Canvas3D') as HTMLCanvasElement);
	}, [])

	return (
		<div className="Page">
			<canvas id="Canvas3D" className={Style.ThreeJsCanvas3D}></canvas>
			<main id="HtmlGridContent" className={Style.HtmlPageContent}>
				<ProjectFirstImpression
					projectName="Unreal VsCode Helper"
					projectDescription="is a VSCode extension that provides a set of tools to help you develop Unreal Engine projects inside VsCode."
					onMoreClicked={() => {
						alert("I'm sorry, this page is not yet implemented.");
					}}
				/>
				<ProjectFirstImpression
					projectName="Hugo Meet"
					projectDescription="is a video meeting platform, that I made to learn how to use WebRTC and video/audio streaming."
					onMoreClicked={() => {
						alert("I'm sorry, this page is not yet implemented.");
					}}
				/>
				<ProjectFirstImpression
					projectName="Procedural Terrain Generator"
					projectDescription="is a video meeting platform, that I made to learn how to use WebRTC and video/audio streaming."
					onMoreClicked={() => {
						alert("I'm sorry, this page is not yet implemented.");
					}}
				/>
			</main>
		</div>
	);
}

export default Index;
