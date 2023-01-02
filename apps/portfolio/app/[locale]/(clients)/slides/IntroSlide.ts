import * as THREE from 'three';

import EventEmitter from 'events';
import { GithubActivities } from 'App/[locale]/page';
import Slide3dBehavior from './Slide3dBehavior';

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

class IntroSlide extends Slide3dBehavior
{
	private _Activities: GithubActivities;
	private _GithubChart: IGithubActivityChart;
	private _Raycaster: THREE.Raycaster;
	private _Mouse = new THREE.Vector2();
	private _InitTrigger: EventEmitter;
	private _GithubLogoObject: THREE.Mesh;
	private _YoutubeLogoObject: THREE.Mesh;

	// Setters
	public set Activities(activities: any) { this._Activities = activities; }

	constructor(activities: any, condensed = false)
	{
		super(
			condensed,
			"Intro", // Scene name
			new THREE.Vector3(0, 30, 0), // Scene position
			new THREE.Vector3(5, 5, 20), // Scene size
			new THREE.Vector3(-0.9, 0., 0) // Camera direction
		);
		// Data fetch from github
		this._Activities = activities;

		// Create a trigger that will be used to trigger the enter at the right time
		// if I dont do this the enter function may be called before the initialisation of the experience is finished
		// using this technique even if we enter the slide before the experience is ready this trigger will trigger the enter behavior when the experience is ready
		this._InitTrigger = new EventEmitter();
	}

	protected onExperienceReady()
	{
		// add the github activities chart to the scene
		this._GithubChart = this.CreateGithubActivitiesChart(new THREE.Vector3(0, 33, 0));
		this._GithubChart.cubes.forEach((cube) => {
			this._Scene.add(cube.mesh);
		});
		// Trigger the enter function
		this._InitTrigger.emit('trigger');
	}

	private realEnterFunction(direction: number)
	{
		if (this._Experience.IsReady)
		{
			// Same position has the start of the next slide
			const camPosition = this.GetCameraPositionToFocusBox(this._BoundingBox, this._CameraDirection);

			if (direction === 1 /* From above */) {
				// Instant tp to the right first position (this will only be called by the slideshow constructor since it's the first slide)
				this._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z, true);
				this._Camera.Focus(this._ScenePosition, true);
			}
			else {
				// Move the camera to look at the scene
				this._Camera.AnimatesToWhileFocusing(
					// Find camera position from the scene boundingbox and the camera direction
					camPosition,
					// where to look at
					this._ScenePosition,
					0.025
				);
			}
		}

		this._Raycaster = new THREE.Raycaster();
		this._Mouse = new THREE.Vector2();
		this._GithubLogoObject = this._Scene.children[0] as THREE.Mesh;
		this._YoutubeLogoObject = this._Scene.children[1] as THREE.Mesh;

		// Listen on the mouse moving and check if the cursor is hovering the github or youtube logo
		document.addEventListener('mousemove', (ev) => this.MouseMoveListener(ev));
		// Listen on the mouse click and check if the cursor is hovering the github or youtube logo
		document.addEventListener('click', (ev) => this.ClickEventListener(ev));
	}

	public onEnter(direction: number)
	{
		// if not fully initialized, wait for the trigger to be called
		if (this._Experience.IsReady) {
			this.realEnterFunction(direction);
		}
		else {
			this._InitTrigger.on('trigger', () => this.realEnterFunction(direction));
		}
	}

	public onScroll(progress: number)
	{
		if (this._Experience.IsReady) {
			// * 1.75 to allow the animation to end before the end of the scroll, so you can actually see the result
			const scrollCubeProgress = Math.floor(progress * 365 * 1.75);

			this._GithubChart.cubes.forEach((cube, index) => {
				// Change the color of the cube according to the scroll progress (default if bellow the scroll progress, or his color if it's a past/current day)
				cube.mesh.material = (index < scrollCubeProgress ? this._GithubChart.materials[cube.material] : this._GithubChart.materials[0]);
			});

			// if the screen is not wide enough, rotate the camera to focus on the current cube
			if (this._Condensed) {
				// Get the current cube to focus on
				const currentAnimationCube = this._GithubChart.cubes[Math.max(Math.min(scrollCubeProgress, this._GithubChart.cubes.length - 1), 0)];
				// Get his position
				let focusPos = new THREE.Vector3();
				currentAnimationCube.mesh.getWorldPosition(focusPos);
				// Do not change the heigth and the depth of the focus point
				focusPos.x = this._ScenePosition.x;
				focusPos.y = this._ScenePosition.y;
				// Divide the width by 2 to follow the cube but not keeping it in the center of the screen
				focusPos.z = focusPos.z / 2;
				this._Camera.Focus(focusPos, true);
			}
		}
	}

	public onLeave(direction: number)
	{
		if (this._Experience.IsReady) {
			// Cancel Anim in case your scrolling fast
			this._Camera.CancelAnimation();
			// unfocus from the scene center
			this._Camera.Unfocus();
		}

		this._InitTrigger.removeAllListeners();

		document.removeEventListener('mousemove', (ev) => this.MouseMoveListener(ev));
		document.removeEventListener('click', (ev) => this.ClickEventListener(ev));
	}

	// Using the weeks data, create a cube chart of 7 cube for each column where each column represent a week
	private CreateGithubActivitiesChart(chartPos: THREE.Vector3)
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
		const weeks = this._Activities.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];

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

		}
		return (chart);
	}

	private MouseMoveListener(event: MouseEvent)
	{
		event.preventDefault();

		this._Mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this._Mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		this._Raycaster.setFromCamera(this._Mouse, this._Camera.PerspectiveCamera);

		// Check intersection
		const interactableObjects = [this._GithubLogoObject, this._YoutubeLogoObject];
		const intersects = this._Raycaster.intersectObjects(interactableObjects);

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

	private ClickEventListener(event: MouseEvent)
	{
		event.preventDefault();

		this._Mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this._Mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		this._Raycaster.setFromCamera(this._Mouse, this._Camera.PerspectiveCamera);

		// Check intersection
		const interactableObjects = [this._GithubLogoObject, this._YoutubeLogoObject];
		const intersects = this._Raycaster.intersectObjects(interactableObjects);

		if (intersects.length > 0) {
			// redirect to my github if the client click on the github logo
			if (intersects[0].object === this._GithubLogoObject) {
				window.location.assign('/redirects/github');
			}
			// redirect to my youtube if the client click on the youtube logo
			else if (intersects[0].object === this._YoutubeLogoObject) {
				window.location.assign('/redirects/youtube');
			}
		}
	}
}

export default IntroSlide;