import Style from '@styles/pages/index.module.scss';
import { useEffect } from 'react';

import Canvas3D from '@3D/Canvas3D';
import ProjectFirstImpression from '@Components/ProjectFirstImpression';

import GithubStats from '@Components/ProjectStats/GithubStats';
import YoutubeStats from '@Components/ProjectStats/YoutubeStats';
import VsCodeStats from '@Components/ProjectStats/VsCodeStats';

export function Index() {
	useEffect(() => {
		new Canvas3D(document.getElementById("Canvas3D") as HTMLCanvasElement);
	}, [])

	return (
		<section className="Page">
			<canvas id="Canvas3D" className={Style.ThreeJsCanvas3D}></canvas>
			<main id="HtmlGridContent" className={Style.HtmlPageContent}>
				{/* UNREAL VSCODE HELPER */}
				<ProjectFirstImpression
					className={Style.ProjectUVCH}
					projectName="Unreal VsCode Helper"
					projectDescription="is a VSCode extension that provides a set of tools to help you develop Unreal Engine projects inside VsCode."
				>
					<div className={Style.ProjectStats}>
						<a href="https://www.youtube.com/watch?v=_usDZ6osnR4">
							<YoutubeStats views={92_197} />
						</a>
						<a href="https://marketplace.visualstudio.com/items?itemName=HugoCabel.uvch">
							<VsCodeStats name="HugoCabel.uvch"/>
						</a>
						<a href="https://github.com/hcabel/UnrealVsCodeHelper">
							<GithubStats repoUrl="https://github.com/hcabel/UnrealVsCodeHelper" />
						</a>
					</div>
				</ProjectFirstImpression>
				{/* HUGO MEET */}
				<ProjectFirstImpression
					className={Style.ProjectHugoMeet}
					projectName="Hugo Meet"
					projectDescription="is a video meeting platform, that I made to learn how to use WebRTC and video/audio streaming."
				>
					<div className={Style.ProjectStats}>
						<a href="https://www.youtube.com/watch?v=2oupECsHxPU">
							<YoutubeStats views={1_154 + 218} />
						</a>
						<a href="https://github.com/hcabel/HugoMeet">
							<GithubStats repoUrl="https://github.com/hcabel/HugoMeet" />
						</a>
					</div>
				</ProjectFirstImpression>
				{/* PROCEDURAL TERRAIN */}
				<ProjectFirstImpression
					className={Style.ProjectProceduralTerrain}
					projectName="Procedural Terrain"
					projectDescription="This is a Unreal Engine actor who's gonna generate infinite terrain in any of your game. (Like Minecraft)"
				>
					<div className={Style.ProjectStats}>
						<a href="https://www.youtube.com/watch?v=MHB8Tn3zbqM">
							<YoutubeStats views={7_034} />
						</a>
					</div>
				</ProjectFirstImpression>
			</main>
		</section>
	);
}

export default Index;
