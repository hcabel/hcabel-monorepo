import { useEffect, useRef } from 'react';

import * as THREE from 'three';

import Style from 'Styles/pages/index.module.scss';

import Experience from '3D/Experience';
import ProjectFirstImpression from 'Components/ProjectFirstImpression';
import { IRouteGetAllProjects, IRouteGetProjectById } from '@hcabel/types/ProjectApi';
import SlideShow from 'Components/SlideShow/SlideShow';
import Slide from 'Components/SlideShow/Slide';

export function Index({ staticProps }: any) {
	const _BackgroundRef = useRef<HTMLDivElement>(null);

	// Hide all the background exect the one with the class that we specified
	function	UpdateBackground(className: string)
	{
		const backgroundChild = _BackgroundRef.current?.children;
		if (!backgroundChild) {
			return;
		}

		// Change opcatity of all background children to 0 unless there is implementing className
		for (let i = 0; i < backgroundChild.length; i++) {
			if (backgroundChild[i].classList.contains(className)) {
				// set opactiy to 1
				backgroundChild[i].classList.remove(Style.Opacity_Hidden);
				backgroundChild[i].classList.add(Style.Opacity_Visible);
			} else {
				// set opactiy to 0
				backgroundChild[i].classList.add(Style.Opacity_Hidden);
				backgroundChild[i].classList.remove(Style.Opacity_Visible);
			}
		}

	}

	useEffect(() => {
		new Experience(document.getElementById("Canvas3D") as HTMLCanvasElement);
	}, []);

	const slideTransitionSpeed = 0.025;

	return (
		<section className="Page">
			<canvas id="Canvas3D" className={Style.ThreeJsCanvas3D}></canvas>
			<div className={Style.Background} ref={_BackgroundRef}>
				<div className={`${Style.Background_Ocean} ${Style.Background}`} />
				<div className={`${Style.Background_Peach} ${Style.Background}`} />
			</div>
			<main className={Style.HtmlPageContent} id="HtmlPageContent" >
				<SlideShow>
					{/* UNREAL VSCODE HELPER */}
					<Slide
						onConstruct={(self: any) => {
							self._ScenePosition = new THREE.Vector3(0, 2, 0);

							self._Camera = new Experience().World.Camera;
							self._CamPath = new THREE.CatmullRomCurve3([
								new THREE.Vector3(-0.25, 0.5, -0.825),
								new THREE.Vector3(-0.675, 0.225, -0.675),
								new THREE.Vector3(-0.825, 0.5, 0),
							]);
							// Distance from the middle of the scene
							self._PathDistance = new THREE.Vector3(25, 25, 25);
						}}
						onEnter={(self: any, direction: number) => {
							UpdateBackground(Style.Background_Ocean);

							if (direction === 1 /* Top to bottom */) {
								// Instant tp to the right first position (this will only be called by the slideshow constructor since it's the first slide)
								const camPosition = self._CamPath.getPointAt(0)
									.multiply(self._PathDistance)
									.add(self._ScenePosition);
								self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z, true);
								self._Camera.Focus(self._ScenePosition, true);
							}
							else {
								const camPosition = self._CamPath.getPointAt(1)
									.multiply(self._PathDistance)
									.add(self._ScenePosition);
								self._Camera.AnimatesToFocalPoint(camPosition, self._ScenePosition, slideTransitionSpeed);
							}
						}}
						onScroll={(self: any, progress: number) => {
							// follow path
							const camPosition = self._CamPath.getPointAt(progress)
								.multiply(self._PathDistance)
								.add(self._ScenePosition);
							self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z);
						}}
						onLeave={(self: any, direction: number) => {
							self._Camera.CancelAnimation();
							self._Camera.Unfocus();
						}}
						Length={200}
						LeaveTransition={{
							duration: 0.75,
						}}
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
					<Slide
						onConstruct={(self: any) => {
							self._Camera = new Experience().World.Camera;

							self._ScenePosition = new THREE.Vector3(0, -35, 0);
							// The path to follow, only represente direction not the actual position
							self._CamPath = new THREE.CatmullRomCurve3([
								new THREE.Vector3(-1, 1, -0.75),
								new THREE.Vector3(-1, 0.5, 0.75),
							]);
							// Distance from the middle of the scene
							self._PathDistance = new THREE.Vector3(25, 25, 25);
						}}
						onEnter={(self: any, direction: number) => {
							UpdateBackground(Style.Background_Peach);

							// Get either the start or the end of the path depending on the direction where the scroll is from
							const camPosition = self._CamPath
								.getPointAt(direction === -1 ? 1 : 0)
								.multiply(self._PathDistance)
								.add(self._ScenePosition);
							self._Camera.AnimatesToFocalPoint(camPosition, self._ScenePosition, slideTransitionSpeed);
						}}
						onScroll={(self: any, progress: number) => {
							// follow path
							const camPosition = self._CamPath
								.getPointAt(progress)
								.multiply(self._PathDistance)
								.add(self._ScenePosition);
							self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z);
						}}
						onLeave={(self: any, direction: number) => {
							self._Camera.CancelAnimation();
							self._Camera.Unfocus();
						}}
						LeaveTransition={{
							duration: 0.75,
						}}
					>
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
					{/* <Slide>
						<div className={Style.FirstImpressionArea}>
							<ProjectFirstImpression
								staticProps={staticProps["Procedural Terrain"]}
								className={Style.ProjectProceduralTerrain}
							/>
						</div>
					</Slide> */}
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
