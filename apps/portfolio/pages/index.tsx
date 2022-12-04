import { useEffect } from 'react';

import * as THREE from 'three';

import Style from 'Styles/pages/index.module.scss';

import Experience from '3D/Experience';
import ProjectFirstImpression from 'Components/ProjectFirstImpression';
import { IRouteGetAllProjects, IRouteGetProjectById } from '@hcabel/types/ProjectApi';
import SlideShow from 'Components/SlideShow/SlideShow';
import Slide from 'Components/SlideShow/Slide';

export function Index({ staticProps }: any) {
	useEffect(() => {
		new Experience(document.getElementById("Canvas3D") as HTMLCanvasElement);
	}, []);

	return (
		<section className="Page">
			<canvas id="Canvas3D" className={Style.ThreeJsCanvas3D}></canvas>
			<div className={Style.Background} />
			<main className={Style.HtmlPageContent} id="HtmlPageContent">
				<SlideShow>
					{/* UNREAL VSCODE HELPER */}
					<Slide
						onConstruct={(self: any) => {
							self._ScenePosition = new THREE.Vector3(0, 2, 0);

							self._Camera = new Experience().World.Camera;
							self._CamPath = new THREE.CatmullRomCurve3([
								new THREE.Vector3(-7, 15, -25).normalize(),
								new THREE.Vector3(-15, 5, -15).normalize(),
								new THREE.Vector3(-25, 15, 2).normalize(),
							]);
						}}
						onEnter={(self: any, direction: number) => {
							if (direction === 1 /* Top to bottom */) {
								// Instant tp to the right first position (this will only be called by the slideshow constructor since it's the first slide)
								const camPosition = self._CamPath.getPointAt(1).multiply(new THREE.Vector3(25, 25, 25));
								self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z, true);
								self._Camera.Focus(self._ScenePosition, true);
							}
							else {
								const camPosition = self._CamPath.getPointAt(direction === -1 ? 1 : 0).multiply(new THREE.Vector3(25, 25, 25));
								self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z, false, 0.005);
								self._Camera.Focus(self._ScenePosition, false, 0.005);
							}
						}}
						onScroll={(self: any, progress: number) => {
							// follow path
							const camPosition = self._CamPath.getPointAt(progress).multiply(new THREE.Vector3(25, 25, 25));
							self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z);
						}}
						Length={200}
					>
						<div className={Style.FirstImpressionArea}>
							<ProjectFirstImpression
								staticProps={staticProps["Unreal VsCode Helper"]}
								className={Style.ProjectUVCH}
								moreButtonRedirection="/projects/unreal-vscode-helper"
							/>
						</div>
					</Slide>
					{/* HUGO MEET */}
					<Slide>
						<div className={Style.FirstImpressionArea}>
							<ProjectFirstImpression
								staticProps={staticProps["HugoMeet"]}
								className={Style.ProjectHugoMeet}
								moreButtonRedirection={"/projects/hugomeet"}
								moreTextOverride="Explore HugoMeet"
							/>
						</div>
					</Slide>
					{/* PROCEDURAL TERRAIN */}
					<Slide>
						<div className={Style.FirstImpressionArea}>
							<ProjectFirstImpression
								staticProps={staticProps["Procedural Terrain"]}
								className={Style.ProjectProceduralTerrain}
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
	// Get all projects
	const projects: IRouteGetAllProjects = await fetch(`${process.env.NX_PROJECT_API_ENDPOINT}/projects`)
		.then((res) => res.json());

	// Create promise that will fetch all the project in parallel
	const staticProps = await new Promise<any>((resolve, reject) => {
		const staticData: any = {};
		let asyncRequest = 0;

		function MakeAsyncRequest(url: string)
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
					.then((project: IRouteGetProjectById) => {
						staticData[project.name] = project;

						asyncRequest--;
						if (asyncRequest === 0) {
							resolve(staticData);
						}
					})
					.catch(reject)
			);
		}

		for (const project of projects) {
			MakeAsyncRequest(`${process.env.NX_PROJECT_API_ENDPOINT}/projects/${project._id}`);
		}
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
