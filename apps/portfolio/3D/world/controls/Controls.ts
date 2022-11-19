import * as THREE from 'three';

import Camera from '3D/world/Camera';
import ControlSteps, { AControlsStep } from './ControlSteps';

class Controls
{
	// Quick access
	protected _Camera: Camera;

	// Own properties
	protected _ControlSteps: AControlsStep[] = [];

	// Own properties getters
	get Steps(): AControlsStep[] { return this._ControlSteps; }

	constructor(InCamera: Camera)
	{
		this._Camera = InCamera;

		// Init steps
		for (let i = 0; i < ControlSteps.length; i++) {
			this._ControlSteps.push(new ControlSteps[i](
				this._Camera
			));
		}

		// Set start camera position
		this._Camera.MoveTo(0, 0, 0, true);
		this._Camera.RotateTo(new THREE.Quaternion(), true);

		this.Resize();
	}

	public Resize()
	{
		for (let i = 0; i < this._ControlSteps.length; i++) {
			this._ControlSteps[i].Resize();
		}

		// calculate z depth to fit project in viewport
		// const z = this.GetFocusZDistance();

		// calculate x position where the cube should be in the middle of the screen on mobile and on the left on desktop
		// const x = window.innerWidth > 920 ? this.GetXFocusDistance(z) : 0;

		// Move camera to new location
		// this._Camera.MoveTo(x, this._Camera.PerspectiveCamera.position.y, z, true);
		// this._ScrollTrigger.refresh();
	}

	public Update()
	{
		for (let i = 0; i < this._ControlSteps.length; i++) {
			this._ControlSteps[i].Update();
		}
	}

	// /**
	//  * This function will calculate the z distance of the camera from the focusBoxSize
	//  * @returns z distance to fit project in viewport
	//  */
	// private GetFocusZDistance(): number
	// {
	// 	const objectSizes: THREE.Vector3 = Controls._ProjectFocusBoxSize;
	// 	const objectSize = Math.max(objectSizes.x, objectSizes.y, objectSizes.z);

	// 	const cameraFov = this._Camera.PerspectiveCamera.fov;
	// 	const heigthCameraView = 2.0 * Math.tan(THREE.MathUtils.degToRad(cameraFov / 2));
	// 	let distanceHeigth = objectSize / heigthCameraView;
	// 	distanceHeigth += objectSize / 2;

	// 	const widthCameraView = heigthCameraView * this._Camera.PerspectiveCamera.aspect;
	// 	let distanceWidth = objectSize / widthCameraView;
	// 	distanceWidth += objectSize / 2;

	// 	return (Math.max(distanceWidth, distanceHeigth));
	// }

	// private GetXFocusDistance(zDepthDistance: number): number
	// {
	// 	const objectSizes: THREE.Vector3 = Controls._ProjectFocusBoxSize;
	// 	const objectSize = Math.max(objectSizes.x, objectSizes.y, objectSizes.z);

	// 	const cameraFov = this._Camera.PerspectiveCamera.fov;
	// 	const heigthCameraView = 2.0 * Math.tan(THREE.MathUtils.degToRad(cameraFov / 2));
	// 	const widthCameraView = heigthCameraView * this._Camera.PerspectiveCamera.aspect;

	// 	const distanceToProject = zDepthDistance - objectSize / 2;
	// 	const distanceToWindowRightEdge = -(widthCameraView * distanceToProject) / 2;

	// 	return (distanceToWindowRightEdge + objectSize / 2);
	// }
}

export default Controls;