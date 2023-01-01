import * as THREE from 'three';

import Experience from '3D/Experience';
import EventEmitter from 'events';

class IntroSlide {
	private static _Instance: IntroSlide;

	private _Activities: any = undefined;

	// Getters
	public static get Instance(): IntroSlide { return this._Instance; }

	// Setters
	public set Activities(activities: any) { this._Activities = activities; }

	public constructor(activities: any)
	{
		if (!IntroSlide._Instance) {
			IntroSlide._Instance = this;
		}

		this._Activities = activities;
	}

	public onConstruct(self: any)
	{
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
		new Experience().on('ready', () => IntroSlide.Instance.onConstructWhenExperienceIsReady(self));
	}

	private onConstructWhenExperienceIsReady(self: any)
	{
		// Boundingbox helper
		// const helper = new THREE.Box3Helper(self._BoundingBox, new THREE.Color(0xff0000));
		// new Experience().World.Scene.add(helper);

		self._Camera = new Experience().World.Camera;
		self._IntroScene = new Experience().World.MeshScenes["Intro"];

		// add the github activities chart to the scene
		self._GithubChart = this.CreateGithubActivitiesChart(new THREE.Vector3(5, 33, 0));
		self._GithubChart.cubes.forEach((cube: any) => {
			self._IntroScene.add(cube.mesh);
		});

		self._CurrentDayCubeIndex = Math.floor((this._Activities.data?.user?.contributionsCollection?.contributionCalendar?.weeks as any[] || [])
			.reduce((acc, week) => acc + week.contributionDays.length, 0));


		// Trigger the enter function
		self._FullyInitialized = true;
		self._InitTrigger.emit('trigger');
	}

	private realEnterFunction(self: any, direction: number) {
		if (self._Camera) {

			// Same position has the start of the next slide
			const camPosition = this.GetCameraPositionToFocusBox(self._BoundingBox, direction === 1 ? self._CameraDirectionStart : self._CameraDirectionEnd);

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
					window.location.assign('/redirects/github');
				}
				// redirect to my youtube if the client click on the youtube logo
				else if (intersects[0].object === youtubeLogoObject) {
					window.location.assign('/redirects/youtube');
				}
			}
		}
		document.addEventListener('click', self._ClickEventListener);
	}

	public onEnter(self: any, direction: number)
	{

		// if not fully initialized, wait for the trigger to be called
		if (self._FullyInitialized) {
			this.realEnterFunction(self, direction);
		}
		else {
			self._InitTrigger.on('trigger', () => IntroSlide.Instance.realEnterFunction(self, direction));
		}
	}

	public onScroll(self: any, progress: number)
	{
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
			const camPosition = IntroSlide.Instance.GetCameraPositionToFocusBox(self._BoundingBox, lerpDirection);
			// Move the camera to this position
			self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z, true);
		}
	}

	public onLeave(self: any, direction: number)
	{
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

	// Using the weeks data, create a cube chart of 7 cube for each column where each column represent a week
	private CreateGithubActivitiesChart(chartPos: THREE.Vector3)
	{
		// contants
		const cubeSize = 0.4;
		const cubeSpacing = 0.2;
		const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

		const amountOfDayInThisYear = (new Date().getFullYear() % 4 === 0 ? 366 : 365);

		const chart = {
			pos: new THREE.Vector3(
				chartPos.x,
				chartPos.y,
				chartPos.z - (((amountOfDayInThisYear / 7) * (cubeSize + cubeSpacing)) / 2)
			),
			cubes: [] as any,
			materials: [
				new THREE.MeshBasicMaterial({ color: 0x111111 }), // default
			]
		};

		// The my github contributions for every week of this year
		const weeks = this._Activities.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
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
		const lastCubePos = (chart.cubes.length === 0 ? { x: 0, y: 0 } : chart.cubes[chart.cubes.length - 1].pos);
		const cubeAlreadyCreated = chart.cubes.length;
		for (let futureDayCubeIndex = 0; cubeAlreadyCreated + futureDayCubeIndex <= amountOfDayInThisYear; futureDayCubeIndex++) {
			// Create the cube
			const mesh = new THREE.Mesh(cubeGeometry, chart.materials[0]);

			// Create an object that will contain all the usefull data related to the cube
			const cubeData = {
				mesh: mesh,
				material: chart.materials[0],
				pos: { // The position of the cube in the chart
					x: lastCubePos.x + Math.floor(futureDayCubeIndex !== 0 ? futureDayCubeIndex / 7 : 0),
					y: lastCubePos.y + (futureDayCubeIndex % 7)
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

			if (futureDayCubeIndex === 0) {
				console.log(mesh.position, lastCubePos.x, Math.floor(futureDayCubeIndex / 7), cubeData.pos.x);
			}
		}

		return (chart);
	}

	/**
	 * This function will find the distance in a direction where the 3D box is fully in the fov of the camera
	 * @param {Box3} fbox The focus box
	 * @param {Vector3} direction The direction of the camera
	 * @return {Vector3} The position of the camera
	 */
	private GetCameraPositionToFocusBox(fbox: THREE.Box3, direction: THREE.Vector3): THREE.Vector3
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


}

export default IntroSlide;