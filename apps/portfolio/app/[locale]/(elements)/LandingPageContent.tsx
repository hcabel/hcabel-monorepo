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
		val = window.screen.width >= 920 ? val : 0;
		if (canvas) {
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

		function resize() {
			slideShowController.emit('refresh');
		}

		// listen to resize and move canvas to 0 if the screen is too small
		window.addEventListener('resize', resize);

		return () => {
			// unsubscribe from AllowCookies changes
			window.removeEventListener('resize', resize);
		};
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

	/**
	 * This function will find the distance in a direction where the 3D box is fully in the fov of the camera
	 * @param {Box3} fbox The focus box
	 * @param {Vector3} direction The direction of the camera
	* @return {Vector3} The position of the camera
	 */
	function GetCameraPositionToFocusBox(fbox: THREE.Box3, direction: THREE.Vector3): THREE.Vector3
	{
		// WARN: This function is not working perfectly, it's the closest I could get to the result I wanted
		// And with some tweaking it's working well enough for my use case
		const camera = new Experience().World.Camera.PerspectiveCamera;
		const fov = camera.fov;
		const aspect = camera.aspect;

		const boxCenter = new THREE.Vector3();
		fbox.getCenter(boxCenter);
		const boxSizes = new THREE.Vector3();
		fbox.getSize(boxSizes);
		let radius = Math.max(boxSizes.x, boxSizes.y, boxSizes.z);

		if (aspect > 1) {
			radius /= aspect;
		}

		const halfFovRadian = THREE.MathUtils.degToRad(fov / 2);
		const distance = radius / Math.tan(halfFovRadian);
		const cameraOffset = direction.normalize().multiplyScalar(distance);

		const pos = new THREE.Vector3();
		pos.addVectors(boxCenter, cameraOffset);

		return (pos);
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
				// Create a trigger that will be used to trigger the enter at the right time
				// if I dont do this the enter function may be called before the initialisation of the experience is finished
				// using this technique even if we enter the slide before the experience is ready this trigger will trigger the enter behavior when the experience is ready
				self._InitTrigger = new EventEmitter();
				// The position of the intro scene
				self._ScenePosition = new THREE.Vector3(0, 30, 0);

				// The bounding box of the intro scene
				self._BoundingBox = new THREE.Box3();
				self._BoundingBox.setFromCenterAndSize(
					self._ScenePosition,
					new THREE.Vector3(5, 5, 20)
				);

				// The direction of the camera when the scroll position is 0
				self._CameraDirectionStart = new THREE.Vector3(-0.9, 0.1, 0);
				// The direction of the camera when the scroll position is 1
				self._CameraDirectionEnd = new THREE.Vector3(-0.9, -0.1, 0);

				// Get 3d camera ref
				new Experience().on('ready', () => {
					// Boundingbox helper
					// const helper = new THREE.Box3Helper(self._BoundingBox, new THREE.Color(0xff0000));
					// new Experience().World.Scene.add(helper);

					self._Camera = new Experience().World.Camera;
					self._IntroScene = new Experience().World.MeshScenes["Intro"];

					// add the github activities chart to the scene
					self._GithubChart = CreateGithubActivitiesChart(new THREE.Vector3(5, 33, 0));
					self._GithubChart.cubes.forEach((cube: any) => {
						self._IntroScene.add(cube.mesh);
					});

					self._CurrentDayCubeIndex = Math.floor(props.activities.data.user.contributionsCollection.contributionCalendar.weeks
						.reduce((acc, week) => acc + week.contributionDays.length, 0));


					// Trigger the enter function
					self._FullyInitialized = true;
					self._InitTrigger.emit('trigger');
				});
			},
			onEnter: (self: any, direction: number) => {
				// Change background
				UpdateBackground(Style.Background_NightClub);
				// Move canvas to the center
				MoveCanvas(0);

				function realEnterFunction() {
					if (self._Camera) {

						// Same position has the start of the next slide
						const camPosition = GetCameraPositionToFocusBox(self._BoundingBox, direction === 1 ? self._CameraDirectionStart : self._CameraDirectionEnd);

						if (direction === 1 /* From above */) {
							// Instant tp to the right first position (this will only be called by the slideshow constructor since it's the first slide)
							self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z, true);
							self._Camera.Focus(self._ScenePosition, true);
						}
						else {
							// Move the camera to look at the scene
							self._Camera.AnimatesToWhileFocusing(
								// Find camera position from the scene boundingbox and the camera direction
								camPosition,
								// where to look at
								self._ScenePosition,
								0.025
							);
						}
					}

					const raycaster = new THREE.Raycaster();
					const mouse = new THREE.Vector2();
					const githubLogoObject = self._IntroScene.children[0];
					const youtubeLogoObject = self._IntroScene.children[1];
					const camera = new Experience().World.Camera.PerspectiveCamera;

					// Listen on the mouse moving and check if the cursor is hovering the github or youtube logo
					self._MouseMoveListener = (event: MouseEvent) => {
						event.preventDefault();

						mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
						mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

						raycaster.setFromCamera(mouse, camera);

						// Check intersection
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
					}
					document.addEventListener('mousemove', self._MouseMoveListener);

					// Listen on the mouse click and check if the cursor is hovering the github or youtube logo
					self._ClickEventListener = (event: MouseEvent) => {
						event.preventDefault();

						mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
						mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

						raycaster.setFromCamera(mouse, camera);

						// Check intersection
						const interactableObjects = [githubLogoObject, youtubeLogoObject];
						const intersects = raycaster.intersectObjects(interactableObjects);

						if (intersects.length > 0) {
							// redirect to my github if the client click on the github logo
							if (intersects[0].object === githubLogoObject) {
								router.push('/redirects/github');
							}
							// redirect to my youtube if the client click on the youtube logo
							else if (intersects[0].object === youtubeLogoObject) {
								router.push('/redirects/youtube');
							}
						}
					}
					document.addEventListener('click', self._ClickEventListener);
				}

				// if not fully initialized, wait for the trigger to be called
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

					// if the screen is not wide enough, rotate the camera to focus on the current cube
					if (window.innerWidth < 920) {
						// Get the current cube to focus on
						const currentAnimationCube = self._GithubChart.cubes[Math.max(Math.min(scrollCubeProgress, self._GithubChart.cubes.length - 1), 0)];
						// Get his position
						let focusPos = new THREE.Vector3();
						currentAnimationCube.mesh.getWorldPosition(focusPos);
						// Do not change the heigth and the depth of the focus point
						focusPos.x = self._ScenePosition.x;
						focusPos.y = self._ScenePosition.y;
						// Divide the width by 2 to follow the cube but not keeping it in the center of the screen
						focusPos.z = focusPos.z / 2;
						self._Camera.Focus(focusPos, true);
					}
				}

				if (self._Camera) {
					// Find the camera direction with the scroll progress
					const lerpDirection = self._CameraDirectionStart.clone().lerp(self._CameraDirectionEnd, progress);
					// Find the camera position of this direction with the bounding box
					const camPosition = GetCameraPositionToFocusBox(self._BoundingBox, lerpDirection);
					// Move the camera to this position
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

				document.removeEventListener('mousemove', self._MouseMoveListener);
				document.removeEventListener('click', self._ClickEventListener);
			}
		});
	}

	function	UvchSlideBehavior()
	{
		return ({
			onConstruct: (self: any) => {
				// The position of the scene in the 3d world
				self._ScenePosition = new THREE.Vector3(0, 2, 0);

				// Uvch scene bounding box
				self._BoundingBox = new THREE.Box3();
				self._BoundingBox.setFromCenterAndSize(
					self._ScenePosition.clone().add(new THREE.Vector3(0, -2, 0)),
					new THREE.Vector3(10, (window.innerWidth >= 920 ? 20 : 15), 10)
				);

				// Camera movements
				self._StartRotationY = Math.PI / 180 * 70;
				self._EndRotationY = Math.PI / 180 * -70;

				new Experience().on('ready', () => {
					// Boundingbox helper
					// const helper = new THREE.Box3Helper(self._BoundingBox, new THREE.Color(0xff0000));
					// new Experience().World.Scene.add(helper);

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
					const camPosition = GetCameraPositionToFocusBox(self._BoundingBox, new THREE.Vector3(-1, 0.25, 0));
					self._Camera.AnimatesToWhileFocusing(camPosition, self._ScenePosition, 0.025);
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

				// Uvch scene bounding box
				self._BoundingBox = new THREE.Box3();
				self._BoundingBox.setFromCenterAndSize(
					self._ScenePosition.clone().add(new THREE.Vector3(0, -2, 0)),
					new THREE.Vector3(10, 15, (window.innerWidth >= 920 ? 22.5 : 20))
				);

				// Camera movements
				self._StartRotationY = Math.PI / 180 * 60;
				self._EndRotationY = Math.PI / 180 * -120;

				new Experience().on('ready', () => {
					// Boundingbox helper
					// const helper = new THREE.Box3Helper(self._BoundingBox, new THREE.Color(0xff0000));
					// new Experience().World.Scene.add(helper);

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
					const camPosition = GetCameraPositionToFocusBox(self._BoundingBox, new THREE.Vector3(-1, 0.25, 0));
					self._Camera.AnimatesToWhileFocusing(camPosition, self._ScenePosition, 0.025);
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

				// Create a box arround the scene to focus on
				self._BoundingBox = new THREE.Box3();
				self._BoundingBox.setFromCenterAndSize(
					self._ScenePosition,
					new THREE.Vector3(12.5, (window.innerWidth >= 920 ? 25 : 20), 12.5)
				);

				// Direction of the camera relavtive to the scene center
				self._CameraDirection = new THREE.Vector3(-1, 1, 0);

				new Experience().on('ready', () => {
					// Debug to show the box to focus
					// const helper = new THREE.Box3Helper(self._BoundingBox, new THREE.Color(0xff0000));
					// new Experience().World.Scene.add(helper);

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
					self._Camera.AnimatesToWhileFocusing(
						// Find camera position from the scene boundingbox and the camera direction
						GetCameraPositionToFocusBox(self._BoundingBox, self._CameraDirection),
						// where to look at
						self._ScenePosition,
						0.025
					);
				}
			},
			onScroll: (self: any, progress: number) => {
				if (self._MeshScene) {
					// Rotate the scene from 45 deg to -315 deg
					self._MeshScene.rotation.y = progress * -(Math.PI * 2 /* 360deg */) + (Math.PI / 4 /* 45deg */);
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