import * as THREE from 'three';

import Experience from "3D/Experience";

class UvchSlide
{
	private static _Instance: UvchSlide;

	// Getters
	public static get Instance(): UvchSlide { return this._Instance; }

	public constructor()
	{
		if (UvchSlide._Instance) {
			return (UvchSlide._Instance);
		}
		UvchSlide._Instance = this;
	}

	public onConstruct(self: any)
	{
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
	}

	public onEnter(self: any, direction: number)
	{
		if (self._Camera) {
			const camPosition = UvchSlide.Instance.GetCameraPositionToFocusBox(self._BoundingBox, new THREE.Vector3(-1, 0.25, 0));
			self._Camera.AnimatesToWhileFocusing(camPosition, self._ScenePosition, 0.025);
		}
	}

	public onScroll(self: any, progress: number)
	{
		if (self._MeshScene) {
			self._MeshScene.rotation.y = progress * self._EndRotationY + self._StartRotationY;
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

export default UvchSlide;