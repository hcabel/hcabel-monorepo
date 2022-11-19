import * as THREE from 'three';
import Camera from "../Camera";

export class AControlsStep
{
	// Quick access
	protected _Camera: Camera;

	constructor(InCamera: Camera) { this._Camera = InCamera; }
	// On webpage size change
	public Resize(): void {}
	// On 3d context is ticking (every frame)
	public Update(): void {}
	// When this step is activated
	public OnEnter(_direction: 1 | -1): void {}
	// When this step is deactivated
	public OnLeave(_direction: 1 | -1): void {}
	// When this step is activated and the client is scrolling
	public OnScroll(_progress: number): void {}
}

// UVCH
export class ControlStep0 extends AControlsStep
{
	// Own properties
	// private _CamPath: THREE.CatmullRomCurve3;

	// constructor(InCamera: Camera)
	// {
	// 	super(InCamera);

	// 	// Create following path
	// 	this._CamPath = new THREE.CatmullRomCurve3([
	// 		new THREE.Vector3(-7, 15, -25).normalize(),
	// 		new THREE.Vector3(-15, 5, -15).normalize(),
	// 		new THREE.Vector3(-25, 15, 2).normalize(),
	// 	]);
	// }

	// public Resize(): void
	// {

	// }

	// public OnEnter(direction: 1 | -1): void
	// {
	// 	const camPosition = this._CamPath.getPointAt(direction === -1 ? 1 : 0).multiply(new THREE.Vector3(25, 25, 25));
	// 	this._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z);
	// 	this._Camera.LookAt(new THREE.Vector3(0, 0, 0));
	// }

	// public OnLeave(_direction: 1 | -1): void
	// {
	// 	this._Camera.MoveTo(this._Camera.PerspectiveCamera.position.x, -2, this._Camera.PerspectiveCamera.position.z);
	// }

	// public OnScroll(progress: number): void
	// {
	// 	// follow path
	// 	const camPosition = this._CamPath.getPointAt(progress).multiply(new THREE.Vector3(25, 25, 25));
	// 	this._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z, true);
	// 	this._Camera.LookAt(new THREE.Vector3(0, 0, 0), true);
	// }
}

// HUGO MEET
export class ControlStep1 extends AControlsStep
{
	// public Resize(): void
	// {

	// }

	// public Update(): void
	// {

	// }

	// public OnEnter(direction: 1 | -1): void
	// {
	// 	console.log(1, "Enter", direction);

	// }

	// public OnLeave(_direction: 1 | -1): void
	// {

	// }

	// public OnScroll(_progress: number): void
	// {

	// }
}

// PROCEDURAL GENERATION
export class ControlStep2 extends AControlsStep
{
	// public Resize(): void
	// {

	// }

	// public Update(): void
	// {

	// }

	// public OnEnter(direction: 1 | -1): void
	// {
	// 	console.log(2, "Enter 1", direction);
	// }

	// public OnLeave(_direction: 1 | -1): void
	// {

	// }

	// public OnScroll(_progress: number): void
	// {

	// }
}

const ControlSteps = [
	ControlStep0,
	ControlStep1,
	ControlStep2,
];
export default ControlSteps;