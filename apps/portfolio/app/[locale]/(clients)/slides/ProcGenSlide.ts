import * as THREE from 'three';

import Experience from "3D/Experience";
import Camera from '3D/world/Camera';

class ProceduralTerrainSlide
{
	private _Experience: Experience;
	private _Camera: Camera;

	private _ScenePosition: THREE.Vector3;
	private _BoundingBox: THREE.Box3;
	private _CameraDirection: THREE.Vector3;
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
			this._ScenePosition,
			new THREE.Vector3(12.5, (this._Condensed ? 20 : 25), 12.5)
		);
	}

	public constructor(condensed = false)
	{
		this._Condensed = condensed;

		// Position of the scene in the 3d world
		this._ScenePosition = new THREE.Vector3(0, -75, 0);

		// Create a box arround the scene to focus on
		this._BoundingBox = new THREE.Box3();
		this._BoundingBox.setFromCenterAndSize(
			this._ScenePosition,
			new THREE.Vector3(12.5, (this._Condensed ? 20 : 25), 12.5)
		);

		// Direction of the camera relavtive to the scene center
		this._CameraDirection = new THREE.Vector3(-1, 1, 0);

		this._Experience = new Experience();
		this._Experience.on('ready', () => {
			// Debug to show the box to focus
			// const helper = new THREE.Box3Helper(this._BoundingBox, new THREE.Color(0xff0000));
			// new Experience().World.Scene.add(helper);

			// get 3d camera
			this._Camera = new Experience().World.Camera;
			// get Procedural terrain scene
			this._Scene = new Experience().World.MeshScenes["Procedural Terrain"];
		});
	}

	public onEnter(direction: number)
	{
		if (this._Experience.IsReady) {
			// Move the camera to look at the scene
			this._Camera.AnimatesToWhileFocusing(
				// Find camera position from the scene boundingbox and the camera direction
				this.GetCameraPositionToFocusBox(this._BoundingBox, this._CameraDirection),
				// where to look at
				this._ScenePosition,
				0.025
			);
		}
	}

	public onScroll(progress: number)
	{
		if (this._Experience.IsReady) {
			// Rotate the scene from 45 deg to -315 deg
			this._Scene.rotation.y = progress * -(Math.PI * 2 /* 360deg */) + (Math.PI / 4 /* 45deg */);
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

export default ProceduralTerrainSlide;