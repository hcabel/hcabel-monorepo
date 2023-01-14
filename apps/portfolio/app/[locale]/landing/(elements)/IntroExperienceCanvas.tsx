"use client";

import * as THREE from "three";

import ExperienceCanvas from "../projects/(shared)/ExperienceCanvas";
import CustomScrollTriggers from "./CustomScrollTriggers";
import { GetCameraPositionToFocusBox } from "../(utils)/3dSceneInteraction";
import { GithubActivities } from "../page";

interface IDailyActivityCube {
	mesh: THREE.Mesh;
	pos: {
		x: number;
		y: number;
	},
	material: number;
}

interface IGithubActivityChart {
	pos: THREE.Vector3;
	cubes: IDailyActivityCube[];
	materials: THREE.MeshBasicMaterial[];
}

interface IIntroExperienceCanvasProps {
	Activities: GithubActivities;
}

export default function IntroExperienceCanvas(props: IIntroExperienceCanvasProps)
{
	function CreateGithubActivitiesChart(chartPos: THREE.Vector3, scene: THREE.Scene)
	{
		// contants
		const cubeSize = 0.4;
		const cubeSpacing = 0.2;
		const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

		const chart: IGithubActivityChart = {
			pos: new THREE.Vector3(
				chartPos.x,
				chartPos.y,
				chartPos.z - ((52.2 /* weeks in a year */ ) * (cubeSize + cubeSpacing) / 2) // calculate half of the size of the chart to center it
			),
			cubes: [],
			materials: [
				new THREE.MeshBasicMaterial({ color: 0x111111 }), // default
			]
		};

		// My github contributions for the past 365 days
		const weeks = props.Activities.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];

		const dailyContributions = weeks.reduce((acc, week, index) => {
			return acc.concat(
				week.contributionDays.map((day) => ({ ...day, week: index }))
			);
		}, []);
		for (const cube of dailyContributions) {
			// convert day.color (which is a hexa color string starting with #) to a number
			const color = parseInt(cube.color.slice(1), 16);

			// Check if the material already exist in 'char.materials'
			let materialIndex = chart.materials.findIndex((material) => material.color.getHex() === color);
			// If not, create it
			if (materialIndex === -1) {
				materialIndex = chart.materials.length;
				chart.materials.push(new THREE.MeshBasicMaterial({ color }));
			}

			// Create an object that will contain all the usefull data related to the cube
			const dailyCube: IDailyActivityCube = {
				mesh: new THREE.Mesh(cubeGeometry, chart.materials[0]),
				material: materialIndex,
				pos: { // The position of the cube in the chart
					x: cube.week,
					y: cube.weekday,
				}
			};
			// add the cube datas to the charts
			chart.cubes.push(dailyCube);
			// Set default material (his color will be controlled with the scroll animation)
			dailyCube.mesh.material = chart.materials[0];

			// curve cube position on the left and the right
			const curve = Math.sin((dailyCube.pos.x / weeks.length) * Math.PI);

			// Set cube 3d position
			dailyCube.mesh.position.set(
				chart.pos.x + curve * 5,
				// This seam confusing and your right, but the scene is not well rotated so the x and y axis are inverted
				chart.pos.y - dailyCube.pos.y * (cubeSize + cubeSpacing),
				chart.pos.z + dailyCube.pos.x * (cubeSize + cubeSpacing)
			);

			// Add the cube to the scene
			scene.add(dailyCube.mesh);

		}
		return (chart);
	}

	return (
		<ExperienceCanvas
			texture="/3dscenes/T_Intro.webp"
			scenePath="/3dscenes/intro_scene.glb"
			style={{
				position: "absolute",
				top: 0,
				width: "100vw",
				height: "100vh",
			}}
			onResize={(experience) => {
				const boundingBox = new THREE.Box3();
				boundingBox.setFromCenterAndSize(
					// Scene position
					new THREE.Vector3(0, 0, 0),
					// Size of the box
					new THREE.Vector3(5, 5, 20)
				);

				// Move camera to make sure the box is always fully visible
				experience.World.Camera.MoveToVector3(
					GetCameraPositionToFocusBox(
						boundingBox,
						new THREE.Vector3(-1, 0, 0),
						experience.World.Camera.PerspectiveCamera
					),
					true
				);
			}}
			onReady={(experience) => {
				const scrollTrigger = CustomScrollTriggers.getTriggerbyId("intro_scroll_trigger");
				if (!scrollTrigger) {
					throw new Error("intro_scroll_trigger is null");
				}

				// Create the chart and add it to the scene
				const githubChart = CreateGithubActivitiesChart(
					new THREE.Vector3(0, 4, 0),
					experience.World.Scene
				);

				const scenePosition = new THREE.Vector3(0, 0, 0);
				experience.World.Camera.Focus(scenePosition, true);

				// Update scene position depending on scroll progress
				function update(progress: number) {
					// * 1.75 to allow the animation to end before the end of the scroll, so you can actually see the result
					const scrollCubeProgress = Math.floor(progress * 365 * 1.75);

					githubChart.cubes.forEach((cube, index) => {
						// Change the color of the cube according to the scroll progress (default if bellow the scroll progress, or his color if it's a past/current day)
						cube.mesh.material = (index < scrollCubeProgress ? githubChart.materials[cube.material] : githubChart.materials[0]);
					});

					// if the screen is not wide enough, rotate the camera to focus on the current cube
					if (window.innerWidth <= 700 && experience.World?.Camera) {
						// Get the current cube to focus on
						const currentAnimationCube = githubChart.cubes[Math.max(Math.min(scrollCubeProgress, githubChart.cubes.length - 1), 0)];
						// Get his position
						let focusPos = new THREE.Vector3();
						currentAnimationCube.mesh.getWorldPosition(focusPos);
						// Do not change the heigth and the depth of the focus point
						focusPos.x = scenePosition.x;
						focusPos.y = scenePosition.y;
						// Divide the width by 2 to follow the cube but not keeping it in the center of the screen
						focusPos.z = focusPos.z / 2;
						experience.World.Camera.Focus(focusPos, true);
					}
				}
				// Update 3d scene when scrolling
				scrollTrigger.onScroll = update;
				// First update to set state before scroll
				update(scrollTrigger.Progress);
			}}
		/>
	);
}