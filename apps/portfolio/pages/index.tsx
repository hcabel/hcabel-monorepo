import { useEffect } from 'react';

import * as THREE from 'three';

import Style from 'Styles/pages/index.module.scss';

import Experience from '3D/Experience';
import ProjectFirstImpression from 'Components/ProjectFirstImpression';
import { IRouteGetProjectInfos } from '@hcabel/types/ProjectApi';
import SlideShow from 'Components/SlideShow/SlideShow';
import Slide from 'Components/SlideShow/Slide';

export function Index({ staticProps }: any) {
	useEffect(() => {
		new Experience(document.getElementById("Canvas3D") as HTMLCanvasElement);
	}, []);

	return (
		<section className="Page">
			<canvas id="Canvas3D" className={Style.ThreeJsCanvas3D}></canvas>
			<main className={Style.HtmlPageContent} id="HtmlPageContent">
				<SlideShow>
					{/* UNREAL VSCODE HELPER */}
					<Slide
						onConstruct={(self: any) => {
							self._Camera = new Experience().World.Camera;
							self._CamPath = new THREE.CatmullRomCurve3([
								new THREE.Vector3(-7, 15, -25).normalize(),
								new THREE.Vector3(-15, 5, -15).normalize(),
							]);
						}}
						onEnter={(self: any, direction: number) => {
							console.log("onEnter", self.index);
							const camPosition = self._CamPath.getPointAt(direction === -1 ? 1 : 0).multiply(new THREE.Vector3(25, 25, 25));
							self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z);
							self._Camera.LookAt(new THREE.Vector3(0, 0, 0));
						}}
						onScroll={(self: any, progress: number) => {
							// follow path
							const camPosition = self._CamPath.getPointAt(progress).multiply(new THREE.Vector3(25, 25, 25));
							self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z, true);
							self._Camera.LookAt(new THREE.Vector3(0, 0, 0), true);
						}}
						LeaveTransition={{
							duration: 0.0
						}}
					>
						<div className={Style.FirstImpressionArea}>
							<ProjectFirstImpression
								className={Style.ProjectUVCH}
								projectName="Unreal VsCode Helper"
								moreButtonRedirection="/projects/unreal-vscode-helper"
								staticProps={staticProps.uvch}
								hideDescription
								hideStats
							/>
						</div>
					</Slide>
					{/* UNREAL VSCODE HELPER */}
					<Slide
						onConstruct={(self: any) => {
							self._Camera = new Experience().World.Camera;
							self._CamPath = new THREE.CatmullRomCurve3([
								new THREE.Vector3(-15, 5, -15).normalize(),
								new THREE.Vector3(-25, 15, 2).normalize(),
							]);
						}}
						onEnter={(self: any, direction: number) => {
							const camPosition = self._CamPath.getPointAt(direction === -1 ? 1 : 0).multiply(new THREE.Vector3(25, 25, 25));
							self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z);
							self._Camera.LookAt(new THREE.Vector3(0, 0, 0));
						}}
						onLeave={(self: any, direction: number) => {
							self._Camera.MoveTo(
								self._Camera.PerspectiveCamera.position.x,
								-3,
								self._Camera.PerspectiveCamera.position.z
							);
						}}
						onScroll={(self: any, progress: number) => {
							// follow path
							const camPosition = self._CamPath.getPointAt(progress).multiply(new THREE.Vector3(25, 25, 25));
							self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z, true);
							self._Camera.LookAt(new THREE.Vector3(0, 0, 0), true);
						}}
					>
						<div className={Style.FirstImpressionArea}>
							<ProjectFirstImpression
								className={Style.ProjectUVCH}
								projectName="Unreal VsCode Helper"
								moreButtonRedirection="/projects/unreal-vscode-helper"
								staticProps={staticProps.uvch}
							/>
						</div>
					</Slide>
					{/* HUGO MEET */}
					<Slide>
						<div className={Style.FirstImpressionArea}>
							<ProjectFirstImpression
								className={Style.ProjectHugoMeet}
								projectName="HugoMeet"
								moreButtonRedirection={"/projects/hugomeet"}
								moreTextOverride="Explore HugoMeet"
								staticProps={staticProps.hugomeet}
							/>
						</div>
					</Slide>
					{/* PROCEDURAL TERRAIN */}
					<Slide>
						<div className={Style.FirstImpressionArea}>
							<ProjectFirstImpression
								className={Style.ProjectProceduralTerrain}
								projectName="Procedural Terrain"
								staticProps={staticProps.procedural_terrain}
							/>
						</div>
					</Slide>
				</SlideShow>
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
