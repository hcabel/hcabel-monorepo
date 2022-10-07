import { useEffect } from 'react';

import Style from 'Styles/pages/index.module.scss';

import Canvas3D from '3D/Canvas3D';
import ProjectFirstImpression from 'Components/ProjectFirstImpression';

export function Index({ staticProps }: any) {
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
					moreButtonRedirection="/projects/unreal-vscode-helper"
					staticProps={staticProps.uvch}
				/>
				{/* HUGO MEET */}
				<ProjectFirstImpression
					className={Style.ProjectHugoMeet}
					projectName="HugoMeet"
					moreButtonRedirection={"/projects/hugomeet"}
					moreTextOverride="Explore HugoMeet"
					staticProps={staticProps.hugomeet}
				/>
				{/* PROCEDURAL TERRAIN */}
				<ProjectFirstImpression
					className={Style.ProjectProceduralTerrain}
					projectName="Procedural Terrain"
					staticProps={staticProps.procedural_terrain}
				/>
			</main>
		</section>
	);
}

export async function getStaticProps()
{
	const staticProps = await new Promise<any>((resolve, reject) => {
		const staticData: any = {};
		let asyncRequest = 0;

		function MakeAsyncRequest(url: string, key: string)
		{
			asyncRequest++;
			fetch(url)
				.then((response) => response.json())
				.then((data) => {
					staticData[key] = data;

					asyncRequest--;
					if (asyncRequest === 0) {
						resolve(staticData);
					}
				});
		}

		MakeAsyncRequest("http://localhost:4200/api/projects/Unreal VsCode Helper", "uvch");
		MakeAsyncRequest("http://localhost:4200/api/projects/HugoMeet", "hugomeet");
		MakeAsyncRequest("http://localhost:4200/api/projects/Procedural Terrain", "procedural_terrain");
	});

	return {
		props: {
			staticProps
		},
		// I revalidate every 24 hours because that when my script is updating the ProjectApi database
		revalidate: 60 * 60 * 24
	};
}

export default Index;
