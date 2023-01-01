import * as THREE from 'three';

import Experience from "3D/Experience";

class ProceduralTerrainSlide
{
	private static _Instance: ProceduralTerrainSlide;

	// Getters
	public static get Instance(): ProceduralTerrainSlide { return this._Instance; }

	public constructor()
	{
		if (ProceduralTerrainSlide._Instance) {
			return (ProceduralTerrainSlide._Instance);
		}
		ProceduralTerrainSlide._Instance = this;
	}

	public onConstruct(self: any)
	{
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
	}

	public onEnter(self: any, direction: number)
	{
		if (self._Camera) {
			// Move the camera to look at the scene
			self._Camera.AnimatesToWhileFocusing(
				// Find camera position from the scene boundingbox and the camera direction
				ProceduralTerrainSlide.Instance.GetCameraPositionToFocusBox(self._BoundingBox, self._CameraDirection),
				// where to look at
				self._ScenePosition,
				0.025
			);
		}
	}

	public onScroll(self: any, progress: number)
	{
		if (self._MeshScene) {
			// Rotate the scene from 45 deg to -315 deg
			self._MeshScene.rotation.y = progress * -(Math.PI * 2 /* 360deg */) + (Math.PI / 4 /* 45deg */);
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