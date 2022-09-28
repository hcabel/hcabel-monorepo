import Style from '@styles/pages/index.module.scss';
import { useEffect, useState } from 'react';

import Canvas3D from '@3D/Canvas3D';
import ProjectFirstImpression from '@Components/ProjectFirstImpression';

import GithubStats from '@Components/ProjectStats/GithubStats';
import YoutubeStats from '@Components/ProjectStats/YoutubeStats';
import VsCodeStats from '@Components/ProjectStats/VsCodeStats';

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
				>
					<div className={Style.ProjectStats}>
						<YoutubeStats views={92_197} />
						<VsCodeStats name="HugoCabel.uvch"/>
						<GithubStats repoUrl="https://github.com/hcabel/UnrealVsCodeHelper" />
					</div>
				</ProjectFirstImpression>
				<ProjectFirstImpression
					className={Style.ProjectHugoMeet}
					projectName="Hugo Meet"
					projectDescription="is a video meeting platform, that I made to learn how to use WebRTC and video/audio streaming."
				>
					<div className={Style.ProjectStats}>
						<YoutubeStats views={1_154 + 218} />
						<GithubStats repoUrl="https://github.com/hcabel/HugoMeet" />
					</div>
				</ProjectFirstImpression>
				<ProjectFirstImpression
					className={Style.ProjectProceduralTerrain}
					projectName="Procedural Terrain"
					projectDescription="This is a Unreal Engine actor who's gonna generate infinite terrain in any of your game. (Like Minecraft)"
				>
					<div className={Style.ProjectStats}>
						<YoutubeStats views={7_034} />
					</div>
				</ProjectFirstImpression>
			</main>
		</section>
	);
}

export default Index;
