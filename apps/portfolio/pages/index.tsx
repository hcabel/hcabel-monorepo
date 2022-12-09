import { useEffect, useRef, useState } from 'react';

import * as THREE from 'three';

import Style from 'Styles/pages/index.module.scss';

import Experience from '3D/Experience';
import ProjectFirstImpression from 'Components/ProjectFirstImpression';
import { IRouteGetProjectById } from '@hcabel/types/ProjectApi';
import SlideShow from 'Components/SlideShow/SlideShow';
import Slide from 'Components/SlideShow/Slide';

import { GetStaticPropsResult } from 'next';

import TranslateIcon from 'Images/TranslateIcon.svg';
import Link from 'next/link';
import Selector from 'Components/Selector';
import { useRouter } from 'next/router';
import EventEmitter from 'events';

interface IStaticProps {
	[key: string]: IRouteGetProjectById;
}

interface IndexProps {
	staticProps: IStaticProps;
}

export function Index({ staticProps }: IndexProps) {
	const [ _SlideShowController ] = useState(new EventEmitter());
	const { locale, locales } = useRouter();
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

	function MoveCanvas(val: number) {
		const canvas = document.getElementById("Canvas3D");
		// move canvas only if the screen is big enough
		if (canvas && window.screen.width >= 920) {
			canvas.style.transform = `translateX(${val}%)`;
		}
	}

	useEffect(() => {
		// get url hashid
		const hashId = window.location.hash.slice(1);
		// Move to the right slide
		let index = 0;
		switch (hashId) {
		default: index = 0; break;
		case "uvch": index = 1; break;
		case "hugomeet": index = 2; break;
		case "procedural-terrain": index = 3; break;
		}
		_SlideShowController.emit('goto', index);

		// Init the exprerience
		new Experience(document.getElementById("Canvas3D") as HTMLCanvasElement);
	}, []);

	useEffect(() => {
		new Experience()
			.on('ready', () => {
				// Refresh canvas to makesure that the 3d camera is well positioned
				_SlideShowController.emit('refresh');
			});
	}, [_SlideShowController]);

	const slideTransitionSpeed = 0.025;

	return (
		<section className="Page">
			<canvas id="Canvas3D" className={Style.ThreeJsCanvas3D}></canvas>
			<div className={Style.Background} ref={_BackgroundRef}>
				<div className={`${Style.Background_NightClub} ${Style.Background}`} />
				<div className={`${Style.Background_Ocean} ${Style.Background}`} />
				<div className={`${Style.Background_Peach} ${Style.Background}`} />
				<div className={`${Style.Background_Meadow} ${Style.Background}`} />
			</div>
			<main className={Style.HtmlPageContent} id="HtmlPageContent" >
				<SlideShow actions={_SlideShowController} >
					{/* WELCOME INTRO */}
					<Slide
						onConstruct={(self: any) => {
							self._ScenePosition = new THREE.Vector3(0, 30, 0);

							new Experience().on('ready', () => {
								// get 3d camera
								self._Camera = new Experience().World.Camera;
							});
						}}
						onEnter={(self: any, direction: number) => {
							// Move canvas to the center
							MoveCanvas(0);
							// Change background
							UpdateBackground(Style.Background_NightClub);

							if (self._Camera) {
								// Same position has the start of the next slide
								const camPosition = new THREE.Vector3(-25, 6.25, 0)
									.add(self._ScenePosition);
								if (direction === 1 /* Top to bottom */) {
									// Instant tp to the right first position (this will only be called by the slideshow constructor since it's the first slide)
									self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z, true);
									self._Camera.Focus(self._ScenePosition, true);
								}
								else {
									self._Camera.AnimatesToFocalPoint(
										camPosition,
										self._ScenePosition,
										slideTransitionSpeed);
								}
							}
						}}
						onLeave={(self: any, direction: number) => {
							if (self._Camera) {
								// Cancel Anim in case your scrolling fast
								self._Camera.CancelAnimation();
								// unfocus from the scene center
								self._Camera.Unfocus();
							}
						}}
					>
						<div className={Style.SlideIntro}>
							<div className={Style.Description}>
								<h1 className={Style.Name}>Hugo Cabel</h1>
								<h3 className={Style.Job}>Software engineer</h3>
							</div>
						</div>
					</Slide>
					{/* UNREAL VSCODE HELPER */}
					<Slide
						onConstruct={(self: any) => {
							// The position of the scene in the 3d world
							self._ScenePosition = new THREE.Vector3(0, 2, 0);
							// Distance from the middle of the scene
							self._PathDistance = new THREE.Vector3(25, 25, 25);
							// Camera movements
							self._StartRotationY = Math.PI / 180 * 70;
							self._EndRotationY = Math.PI / 180 * -70;

							new Experience().on('ready', () => {
								// get 3d camera
								self._Camera = new Experience().World.Camera;

								// Fetch all the 3D object that compose the Procedural terrain scene
								self._MeshScene = new Experience().World.MeshScenes["Unreal VsCode Helper"];
							});
						}}
						onEnter={(self: any, direction: number) => {
							// Change background
							UpdateBackground(Style.Background_Ocean);
							// Move canvas to the right
							MoveCanvas(20);

							if (self._Camera) {
								const camPosition = new THREE.Vector3(-1, 0.25, 0)
									.multiply(self._PathDistance)
									.add(self._ScenePosition);
								self._Camera.AnimatesToFocalPoint(camPosition, self._ScenePosition, slideTransitionSpeed);
							}
						}}
						onScroll={(self: any, progress: number) => {
							if (self._MeshScene) {
								self._MeshScene.rotation.y = progress * self._EndRotationY + self._StartRotationY;
							}
						}}
						onLeave={(self: any, direction: number) => {
							if (self._Camera) {
								// Cancel Anim in case your scrolling fast
								self._Camera.CancelAnimation();
								// unfocus from the scene center
								self._Camera.Unfocus();
							}
						}}
						Length={200}
						LeaveTransition={{
							duration: 0.75,
						}}
					>
						<div className={Style.Slide}>
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
							// The position of the scene in the 3d world
							self._ScenePosition = new THREE.Vector3(0, -33, 0);
							// Distance from the middle of the scene
							self._PathDistance = new THREE.Vector3(20, 20, 20);
							// Camera movements
							self._StartRotationY = Math.PI / 180 * 60;
							self._EndRotationY = Math.PI / 180 * -120;

							new Experience().on('ready', () => {
								// get 3d camera
								self._Camera = new Experience().World.Camera;
								// Fetch all the 3D object that compose the Procedural terrain scene
								self._MeshScene = new Experience().World.MeshScenes["HugoMeet"];
							});
						}}
						onEnter={(self: any, direction: number) => {
							// Move canvas to the right
							MoveCanvas(20);
							// Change background color
							UpdateBackground(Style.Background_Peach);

							if (self._Camera) {
								// Get either the start or the end of the path depending on the direction where the scroll is from
								const camPosition = new THREE.Vector3(-1, 0.25, 0)
									.multiply(self._PathDistance)
									.add(self._ScenePosition);
								self._Camera.AnimatesToFocalPoint(camPosition, self._ScenePosition, slideTransitionSpeed);
							}
						}}
						onScroll={(self: any, progress: number) => {
							if (self._MeshScene) {
								// Rotate the scene from 45 deg to 405 deg
								self._MeshScene.rotation.y = progress * self._EndRotationY + self._StartRotationY;
							}
						}}
						onLeave={(self: any, direction: number) => {
							if (self._Camera) {
								// Cancel Anim in case your scrolling fast
								self._Camera.CancelAnimation();
								// unfocus from the scene center
								self._Camera.Unfocus();
							}
						}}
						LeaveTransition={{
							duration: 0.75,
						}}
						Length={200}
					>
						<div className={Style.Slide}>
							<ProjectFirstImpression
								staticProps={staticProps["HugoMeet"]}
								className={Style.ProjectHugoMeet}
								moreButtonRedirection={"/projects/hugomeet"}
								moreTextOverride="Explore HugoMeet"
							/>
						</div>
					</Slide>
					{/* PROCEDURAL TERRAIN */}
					<Slide
						onConstruct={(self: any) => {
							// Position of the scene in the 3d world
							self._ScenePosition = new THREE.Vector3(0, -75, 0);
							// Distance from the middle of the scene
							self._PathDistance = new THREE.Vector3(20, 20, 20);

							new Experience().on('ready', () => {
								// get 3d camera
								self._Camera = new Experience().World.Camera;
								// get Procedural terrain scene
								self._MeshScene = new Experience().World.MeshScenes["Procedural Terrain"];
							});
						}}
						onEnter={(self: any, direction: number) => {
							// Move canvas to the right
							MoveCanvas(20);
							// Change background color
							UpdateBackground(Style.Background_Meadow);

							if (self._Camera) {
								// Move the camera to look at the scene
								self._Camera.AnimatesToFocalPoint(
									new THREE.Vector3(-1, 1, 0)
										.multiply(self._PathDistance)
										.add(self._ScenePosition),
									self._ScenePosition,
									slideTransitionSpeed);
							}
						}}
						onScroll={(self: any, progress: number) => {
							if (self._MeshScene) {
								// Rotate the scene from 45 deg to 405 deg
								self._MeshScene.rotation.y = progress * (Math.PI * 2 /* 360deg */) + (Math.PI / 4 /* 45deg */);
							}
						}}
						onLeave={(self: any, direction: number) => {
							if (self._Camera) {
								// Cancel Anim in case your scrolling fast
								self._Camera.CancelAnimation();
								// unfocus from the scene center
								self._Camera.Unfocus();
							}
						}}
						Length={300}
					>
						<div className={Style.Slide}>
							<ProjectFirstImpression
								staticProps={staticProps["Procedural Terrain"]}
								className={Style.ProjectProceduralTerrain}
							/>
						</div>
					</Slide>
				</SlideShow>
			</main>
			<Selector
				className={Style.LocalSelector}
				renderSelected={(selected) => (
					<div className={Style.LocalSelected}>
						<TranslateIcon />
						<span>{selected || "language"}</span>
					</div>
				)}
				firstHasDefault
			>
				{[locale, ...locales.filter((lang) => lang !== locale)]
					.map((lang, index) => {
						const regionNamesInEnglish = new Intl.DisplayNames([locale], { type: 'language' });
						return (
							<Link key={index} href="/" locale={lang}>{regionNamesInEnglish.of(lang)}</Link>
						);
					})
				}
			</Selector>
		</section>
	);
}

export async function getStaticProps(): Promise<GetStaticPropsResult<IStaticProps>>
{
	// if does not exist were are skipping the static generation (handy for the pipeline)
	if (!process.env.NX_PROJECT_API_ENDPOINT) {
		return ({
			notFound: true,
		});
	}

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

		// Get all projects
		fetch(`${process.env.NX_PROJECT_API_ENDPOINT}/projects`)
			.then((res) => res.json())
			.then((projects) => {
				// make a parallel request for each project
				for (const project of projects) {
					MakeAsyncRequest(`${process.env.NX_PROJECT_API_ENDPOINT}/projects/${project._id}`);
				}
			})
			.catch(reject);
	})
		.catch(() => {
			// This may occure when API is not found/started
			console.error("GetStaticProps failed: API is not reachable");
			return ({
				// notFound: true
			});
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
