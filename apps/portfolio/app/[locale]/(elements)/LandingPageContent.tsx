"use client";

// Libs
import EventEmitter from 'events';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Extenral project
import { Locales } from '@hcabel/types/ProjectApi';

// Design
import Style from '../page.module.scss';
import TranslateIcon from 'Images/TranslateIcon.svg';
import ArrowIcon from 'Images/arrow.svg';

import Experience from '3D/Experience';

// Components
import Selector from 'Components/Selector/Selector';
import SlideShow from 'Components/SlideShow/SlideShow';
import ExperimentCanvas from './ExperiementCanvas';
import Slide from 'Components/SlideShow/Slide';
import Project from './project/Projects';

// Interfaces
import { GithubActivities, IProjectDatas } from '../page';

// Utils
import CookieManager from 'Utils/CookieManager';
import i18nText from 'Utils/i18Text';

interface ILandingPageContentProps {
	projects: IProjectDatas,
	locale: Locales,
	activities: GithubActivities
};

export default function LandingPageContent(props: ILandingPageContentProps)
{
	const [slideShowController] = useState(new EventEmitter());
	const router = useRouter();

	// Hide all the background exect the one with the class that we specified
	function	UpdateBackground(className: string)
	{
		const backgroundChild = document.getElementById("backgrounds")?.children;
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
		const canvas = document.getElementById("LandingPage3dIllustration");
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
		slideShowController.emit('goto', index);

		// subscribe to AllowCookies changes
		CookieManager.onCookieChange('AllowCookies', (cookieValue) => {
			if (cookieValue === "true") {
				// Send post visit request to the telemetry server
				// This will tell that someone has visited the page
				fetch(`${process.env.NX_TELEMETRY_API_ENDPOINT}/visits`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						href: window.location.href,
					})
				});
			}
		});

	}, []);

	// Using the weeks data, create a cube chart of 7 cube for each column where each column represent a week
	function CreateGithubActivitiesChart(chartPos: THREE.Vector3)
	{
		// contants
		const cubeSize = 0.4;
		const cubeSpacing = 0.2;

		// The my github contributions for every week of this year
		const weeks = props.activities.data.user.contributionsCollection.contributionCalendar.weeks;

		// the geometry of the cube
		const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
		const amountOfDayInThisYear = (new Date().getFullYear() % 4 === 0 ? 366 : 365);

		const chart = {
			pos: new THREE.Vector3(chartPos.x, chartPos.y, chartPos.z + -((amountOfDayInThisYear / 7) * (cubeSize + cubeSpacing)) / 2),
			cubes: [] as any,
			materials: [
				new THREE.MeshBasicMaterial({ color: 0x111111 }), // default
			]
		};

		// create a cube for each week already passed (wheter it has a contribution or not)
		for (let i = 0; i < weeks.length; i++) {
			const week = weeks[i];

			// create a cube for each day of the week
			for (let j = 0; j < week.contributionDays.length; j++) {
				const day = week.contributionDays[j];

				// If not from the current year, don't create the cube
				if (day.date.slice(0, 4) !== new Date().getFullYear().toString()) {
					continue;
				}

				// convert day.color (which is a hexa color string starting with #) to a number
				const color = parseInt(day.color.slice(1), 16);

				// Check if the material already exist in 'char.materials' if not create it
				let mat = chart.materials.find((mat) => mat.color.getHex() === color);
				if (!mat) {
					mat = new THREE.MeshBasicMaterial({ color: color });
					chart.materials.push(mat);
				}

				// if it's today, change the mat to be a pale red
				if (day.date === new Date().toISOString().slice(0, 10)) {
					mat = new THREE.MeshBasicMaterial({ color: 0xff1111 });
				}

				// Create the cube using the default material (his color is controlled with the scroll animation)
				const mesh = new THREE.Mesh(cubeGeometry, chart.materials[0]);

				// Create an object that will contain all the usefull data related to the cube
				const cubeData = {
					mesh: mesh,
					material: mat,
					pos: { // The position of the cube in the chart
						x: i,
						y: j
					}
				};
				// add the cube datas to the charts
				chart.cubes.push(cubeData);

				// curve cube position on the left and the right
				const curve = Math.sin((cubeData.pos.x / weeks.length) * Math.PI);

				// Set cube 3d position
				mesh.position.set(
					chart.pos.x + curve * 5,
					// This seam confusing and your right, but the scene is not well rotated so the x and y axis are inverted
					chart.pos.y - cubeData.pos.y * (cubeSize + cubeSpacing),
					chart.pos.z + cubeData.pos.x * (cubeSize + cubeSpacing)
				);
			}
		}

		// create a cube for each day of the year that his is coming
		const lastCube = chart.cubes[chart.cubes.length - 1];
		const cubeAlreadyCreated = chart.cubes.length;
		for (let futureDayCubeIndex = 0; cubeAlreadyCreated + futureDayCubeIndex <= amountOfDayInThisYear; futureDayCubeIndex++) {
			// Create the cube
			const mesh = new THREE.Mesh(cubeGeometry, chart.materials[0]);

			// Create an object that will contain all the usefull data related to the cube
			const cubeData = {
				mesh: mesh,
				material: chart.materials[0],
				pos: { // The position of the cube in the chart
					x: lastCube.pos.x + Math.floor(futureDayCubeIndex / 7),
					y: lastCube.pos.y + (futureDayCubeIndex % 7)
				}
			};
			// add the cube and his data to the chart
			chart.cubes.push(cubeData);

			// curve cube position on the left and the right
			const curve = Math.sin((cubeData.pos.x / weeks.length) * Math.PI);

			// Set cube 3d position
			mesh.position.set(
				chart.pos.x + curve * 5,
				// This seam confusing and your right, but the scene is not well rotated so the x and y axis are inverted
				chart.pos.y - cubeData.pos.y * (cubeSize + cubeSpacing),
				chart.pos.z + cubeData.pos.x * (cubeSize + cubeSpacing)
			);
		}

		return (chart);
	}

	useEffect(() => {
		new Experience()
			.on('ready', () => {
				// Refresh canvas to makesure that the 3d camera is well positioned
				slideShowController.emit('refresh');
			});
	}, [slideShowController]);

	function	IntroSlideBehavior()
	{
		return ({
			onConstruct: (self: any) => {
				self._ScenePosition = new THREE.Vector3(0, 30, 0);
				self._InitTrigger = new EventEmitter();

				// Get 3d camera ref
				new Experience().on('ready', () => {
					self._Camera = new Experience().World.Camera;
					self._IntroScene = new Experience().World.MeshScenes["Intro"];

					// add the github activities chart to the scene
					self._GithubChart = CreateGithubActivitiesChart(new THREE.Vector3(5, 33, 0));
					self._GithubChart.cubes.forEach((cube: any) => {
						self._IntroScene.add(cube.mesh);
					});

					self._CurrentDayCubeIndex = Math.floor(props.activities.data.user.contributionsCollection.contributionCalendar.weeks
						.reduce((acc, week) => acc + week.contributionDays.length, 0));

					self._FullyInitialized = true;
					self._InitTrigger.emit('trigger');
				});
			},
			onEnter: (self: any, direction: number) => {
				function realEnterFunction() {
					// Move canvas to the center
					MoveCanvas(0);
					// Change background
					UpdateBackground(Style.Background_NightClub);

					if (self._Camera) {
						// Same position has the start of the next slide
						const camPosition = new THREE.Vector3(-25, 0, 0)
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
								0.025);
						}
					}

					const raycaster = new THREE.Raycaster();
					const mouse = new THREE.Vector2();
					const githubLogoObject = self._IntroScene.children[0];
					const youtubeLogoObject = self._IntroScene.children[1];
					const camera = new Experience().World.Camera.PerspectiveCamera;

					// Listen on the mouse moving and check if the cursor is hovering the github or youtube logo
					document.addEventListener('mousemove', (event) => {
						event.preventDefault();

						mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
						mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

						raycaster.setFromCamera(mouse, camera);

						const interactableObjects = [githubLogoObject, youtubeLogoObject];
						const intersects = raycaster.intersectObjects(interactableObjects);
						if (intersects.length > 0) {
							// Change the cursor to a pointer
							document.body.style.cursor = 'pointer';
						}
						else {
							document.body.style.cursor = 'default';
						}

						// increase the size of the object hover by 10% otherwise set it back to normal
						interactableObjects.forEach((object) => {
							if (intersects[0] && object === intersects[0].object) {
								object.scale.set(1.1, 1.1, 1.1);
							}
							else {
								object.scale.set(1, 1, 1);
							}
						});
					});

					// Listen on the mouse click and check if the cursor is hovering the github or youtube logo
					document.addEventListener('click', (event) => {
						event.preventDefault();

						mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
						mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

						raycaster.setFromCamera(mouse, camera);

						const interactableObjects = [githubLogoObject, youtubeLogoObject];
						const intersects = raycaster.intersectObjects(interactableObjects);
						if (intersects.length > 0) {
							if (intersects[0].object === githubLogoObject) {
								router.push('/redirects/github');
							}
							else if (intersects[0].object === youtubeLogoObject) {
								router.push('/redirects/youtube');
							}
						}
					});
				}

				if (self._FullyInitialized) {
					realEnterFunction();
				}
				else {
					self._InitTrigger.on('trigger', realEnterFunction);
				}
			},
			onScroll: (self: any, progress: number) => {
				if (self._IntroScene) {
					// * 1.75 to allow the animation to end before the end of the scroll, so you can actually see the result
					const scrollCubeProgress = Math.floor(progress * 365 * 1.75);

					for (let cubeIndex = 0; cubeIndex < self._GithubChart.cubes.length; cubeIndex++) {
						const cube = self._GithubChart.cubes[cubeIndex];

						// Change the color of the cube according to the scroll progress (default if bellow the scroll progress, or his color if it's a past/current day)
						cube.mesh.material = (cubeIndex < scrollCubeProgress ? cube.material : self._GithubChart.materials[0]);
					}
				}

				if (self._Camera) {
					// move camera up to down by -5 units
					const start = new THREE.Vector3(-25, 2.5, 0)
						.add(self._ScenePosition);
					const end = new THREE.Vector3(-25, -2.5, 0)
						.add(self._ScenePosition);
					const camPosition = start.clone().lerp(end, progress);
					self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z, true);
				}
			},
			onLeave: (self: any, direction: number) => {
				if (self._Camera) {
					// Cancel Anim in case your scrolling fast
					self._Camera.CancelAnimation();
					// unfocus from the scene center
					self._Camera.Unfocus();
				}

				self._InitTrigger.removeAllListeners();
			}
		});
	}

	function	UvchSlideBehavior()
	{
		return ({
			onConstruct: (self: any) => {
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
			},
			onEnter: (self: any, direction: number) => {
				// Change background
				UpdateBackground(Style.Background_Ocean);
				// Move canvas to the right
				MoveCanvas(25);

				if (self._Camera) {
					const camPosition = new THREE.Vector3(-1, 0.25, 0)
						.multiply(self._PathDistance)
						.add(self._ScenePosition);
					self._Camera.AnimatesToFocalPoint(camPosition, self._ScenePosition, 0.025);
				}
			},
			onScroll: (self: any, progress: number) => {
				if (self._MeshScene) {
					self._MeshScene.rotation.y = progress * self._EndRotationY + self._StartRotationY;
				}
			},
			onLeave: (self: any, direction: number) => {
				if (self._Camera) {
					// Cancel Anim in case your scrolling fast
					self._Camera.CancelAnimation();
					// unfocus from the scene center
					self._Camera.Unfocus();
				}
			}
		});
	}

	function	HugoMeetSlideBehavior()
	{
		return ({
			onConstruct: (self: any) => {
				// The position of the scene in the 3d world
				self._ScenePosition = new THREE.Vector3(0, -33, 0);
				// Distance from the middle of the scene
				self._PathDistance = new THREE.Vector3(35, 35, 35);
				// Camera movements
				self._StartRotationY = Math.PI / 180 * 60;
				self._EndRotationY = Math.PI / 180 * -120;

				new Experience().on('ready', () => {
					// get 3d camera
					self._Camera = new Experience().World.Camera;
					// Fetch all the 3D object that compose the Procedural terrain scene
					self._MeshScene = new Experience().World.MeshScenes["HugoMeet"];
				});
			},
			onEnter: (self: any, direction: number) => {
				// Move canvas to the right
				MoveCanvas(25);
				// Change background color
				UpdateBackground(Style.Background_Peach);

				if (self._Camera) {
					// Get either the start or the end of the path depending on the direction where the scroll is from
					const camPosition = new THREE.Vector3(-1, 0.25, 0)
						.multiply(self._PathDistance)
						.add(self._ScenePosition);
					self._Camera.AnimatesToFocalPoint(camPosition, self._ScenePosition, 0.025);
				}
			},
			onScroll: (self: any, progress: number) => {
				if (self._MeshScene) {
					// Rotate the scene from 45 deg to 405 deg
					self._MeshScene.rotation.y = progress * self._EndRotationY + self._StartRotationY;
				}
			},
			onLeave: (self: any, direction: number) => {
				if (self._Camera) {
					// Cancel Anim in case your scrolling fast
					self._Camera.CancelAnimation();
					// unfocus from the scene center
					self._Camera.Unfocus();
				}
			}
		});
	}

	function	ProceduralTerrainSlideBehavior()
	{
		return ({
			onConstruct: (self: any) => {
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
			},
			onEnter: (self: any, direction: number) => {
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
						0.025);
				}
			},
			onScroll: (self: any, progress: number) => {
				if (self._MeshScene) {
					// Rotate the scene from 45 deg to 405 deg
					self._MeshScene.rotation.y = progress * (Math.PI * 2 /* 360deg */) + (Math.PI / 4 /* 45deg */);
				}
			},
			onLeave: (self: any, direction: number) => {
				if (self._Camera) {
					// Cancel Anim in case your scrolling fast
					self._Camera.CancelAnimation();
					// unfocus from the scene center
					self._Camera.Unfocus();
				}
			}
		});
	}

	return (
		<main className="Page">
			<ExperimentCanvas id="LandingPage3dIllustration" /> {/* 3D ILLUSTATION */}
			<div id="backgrounds" className={Style.Background}>
				<div className={`${Style.Background_NightClub} ${Style.Background}`} />
				<div className={`${Style.Background_Ocean} ${Style.Background}`} />
				<div className={`${Style.Background_Peach} ${Style.Background}`} />
				<div className={`${Style.Background_Meadow} ${Style.Background}`} />
			</div>
			<div className={Style.HtmlPageContent} id="HtmlPageContent" >
				<SlideShow
					controller={slideShowController}
				>
					{/* INTRO */}
					<Slide
						{...IntroSlideBehavior()}
						length={100}
						LeaveTransition={{
							duration: 0.75,
						}}
					>
						<div className={Style.SlideIntro}>
							<div className={Style.Description}>
								<h1 className={`h1 ${Style.Name}`} data-cy="my-real-name">Hugo Cabel</h1>
								<h4 className={`h4 ${Style.Job}`} data-cy="my-job">{i18nText("MyJob", props.locale)}</h4>
							</div>
							<div className={Style.MyProject} onClick={() => slideShowController.emit('goto', 1)}>
								<ArrowIcon />
								<h5 className={`h5 ${Style.MyProjectText}`}>{i18nText("MyProjects-Title", props.locale)}</h5>
								<ArrowIcon />
							</div>
						</div>
					</Slide>
					{/* UVCH */}
					<Slide
						{...UvchSlideBehavior()}
						length={200}
						LeaveTransition={{
							duration: 0.75,
						}}
					>
						<div className={Style.Slide}>
							<Project
								locale={props.locale}
								project={props.projects["Unreal VsCode Helper"]}
								className={Style.SlideProjectUVCH}
								moreButtonRedirection="/redirects/unreal-vscode-helper"
							/>
						</div>
					</Slide>
					{/* HUGO MEET */}
					<Slide
						{...HugoMeetSlideBehavior()}
						length={200}
						LeaveTransition={{
							duration: 0.75,
						}}
					>
						<div className={Style.Slide}>
							<Project
								locale={props.locale}
								project={props.projects["HugoMeet"]}
								className={Style.ProjectHugoMeet}
								moreButtonRedirection={"/redirects/hugomeet"}
								moreTextOverride={i18nText("Go to HugoMeet", props.locale)}
							/>
						</div>
					</Slide>
					{/* PROCEDURAL TERRAIN */}
					<Slide
						{...ProceduralTerrainSlideBehavior()}
						length={300}
					>
						<div className={Style.Slide}>
							<Project
								locale={props.locale}
								project={props.projects["Procedural Terrain"]}
								className={Style.ProjectProceduralTerrain}
							/>
						</div>
					</Slide>
				</SlideShow>
			</div>
			<Selector
				className={Style.LocalSelector}
				renderSelected={(selected) => (
					<div data-cy='language-selector'className={`${Style.LocalLink} ${Style.LocalSelected}`}>
						<TranslateIcon />
						<span>{selected || "language"}</span>
					</div>
				)}
				firstHasDefault
			>
				{[ props.locale, ...["fr", "en"].filter((lang) => lang !== props.locale) ]
					.map((lang, index) => {
						const regionNamesInEnglish = new Intl.DisplayNames(lang, { type: 'language' });
						return (
							<span key={index} data-cy={`language-selector-option-${lang}`}>
								<Link className={Style.LocalLink} href={`/${lang}`} locale={lang}>
									{regionNamesInEnglish.of(lang)}
								</Link>
							</span>
						);
					})
				}
			</Selector>
		</main>
	);
}