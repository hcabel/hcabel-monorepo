import { useEffect } from 'react';

import Style from 'Styles/pages/index.module.scss';

import Experience from '3D/Experience';
import ProjectFirstImpression from 'Components/ProjectFirstImpression';
import { IRouteGetProjectInfos } from '@hcabel/types/ProjectApi';

export function Index({ staticProps }: any) {
	useEffect(() => {
		new Experience(document.getElementById("Canvas3D") as HTMLCanvasElement);
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
			asyncRequest += 1;
			return (
				fetch(url)
					.then(async(response) => {
						const data = await response.json();
						if (response.ok === false) {
							return ({
								name: response.status,
								description: data.message || response.statusText || "Nothing turned in",
								stats: []
							});
						}
						return (data);
					})
					.then((data: IRouteGetProjectInfos) => {
						staticData[key] = data;

						asyncRequest--;
						if (asyncRequest === 0) {
							resolve(staticData);
						}
					})
			);
		}

		MakeAsyncRequest(`${process.env.NX_PROJECT_API_ENDPOINT}/Unreal VsCode Helper`, "uvch");
		MakeAsyncRequest(`${process.env.NX_PROJECT_API_ENDPOINT}/HugoMeet`, "hugomeet");
		MakeAsyncRequest(`${process.env.NX_PROJECT_API_ENDPOINT}/Procedural Terrain`, "procedural_terrain");
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
