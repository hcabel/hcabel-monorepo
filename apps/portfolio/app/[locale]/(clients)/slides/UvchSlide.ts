import * as THREE from 'three';

import Experience from "3D/Experience";
import Camera from '3D/world/Camera';

class UvchSlide
{
	private _Experience: Experience;
	private _Camera: Camera;

	private _ScenePosition: THREE.Vector3;
	private _BoundingBox: THREE.Box3;
	private _StartRotationY: number;
	private _EndRotationY: number;
	private _Scene: THREE.Group;
	private _Condensed: boolean = false;

	// Getters
	public get Condensed(): boolean { return this._Condensed; }

	// Setters
	public set Condensed(value: boolean)
	{
		if (this._Condensed !== value) {
			this._Condensed = value;
			this.Resize();
		}
	}

	private Resize()
	{
		this._BoundingBox.setFromCenterAndSize(
			this._ScenePosition.clone().add(new THREE.Vector3(0, -2, 0)),
			new THREE.Vector3(10, (this._Condensed ? 15 : 20), 10)
		);
	}

	public constructor(condensed = false)
	{
		this._Condensed = condensed;

		// The position of the scene in the 3d world
		this._ScenePosition = new THREE.Vector3(0, 2, 0);

		// Uvch scene bounding box
		this._BoundingBox = new THREE.Box3();
		this._BoundingBox.setFromCenterAndSize(
			this._ScenePosition.clone().add(new THREE.Vector3(0, -2, 0)),
			new THREE.Vector3(10, (this._Condensed ? 15 : 20), 10)
		);

		// Camera movements
		this._StartRotationY = Math.PI / 180 * 70;
		this._EndRotationY = Math.PI / 180 * -70;

		this._Experience = new Experience();
		this._Experience.on('ready', () => {
			// Boundingbox helper
			// const helper = new THREE.Box3Helper(this._BoundingBox, new THREE.Color(0xff0000));
			// new Experience().World.Scene.add(helper);

			// get 3d camera
			this._Camera = new Experience().World.Camera;

			// Fetch all the 3D object that compose the Procedural terrain scene
			this._Scene = new Experience().World.MeshScenes["Unreal VsCode Helper"];
		});
	}

	public onEnter(direction: number)
	{
		if (this._Experience.IsReady) {
			const camPosition = this.GetCameraPositionToFocusBox(this._BoundingBox, new THREE.Vector3(-1, 0.25, 0));
			this._Camera.AnimatesToWhileFocusing(camPosition, this._ScenePosition, 0.025);
		}
	}

	public onScroll(progress: number)
	{
		if (this._Experience.IsReady) {
			this._Scene.rotation.y = progress * this._EndRotationY + this._StartRotationY;
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

export default UvchSlide;