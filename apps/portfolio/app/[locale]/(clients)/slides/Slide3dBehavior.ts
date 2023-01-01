import * as THREE from "three";

import Experience from "3D/Experience";
import Camera from "3D/world/Camera";

class Slide3dBehavior
{
	private static Debug: boolean = false;

	// quick accessors
	protected _Experience: Experience;
	protected _Camera: Camera;

	// Own properties
	protected _ScenePosition: THREE.Vector3;
	protected _BoundingBox: THREE.Box3;
	protected _CameraDirection: THREE.Vector3;
	protected _Scene: THREE.Group;
	protected _Condensed: boolean;

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

	protected Resize() {}

	constructor(condensed = false, sceneName: string, scenePosition: THREE.Vector3, sceneSize: THREE.Vector3, cameraDirection: THREE.Vector3)
	{
		// Define if the slide is in condensed mode
		this._Condensed = condensed;
		// Position of the scene in the 3d world
		this._ScenePosition = scenePosition;
		// Create a box arround the scene to focus on
		this._BoundingBox = new THREE.Box3();
		this._BoundingBox.setFromCenterAndSize(
			this._ScenePosition, sceneSize
		);
		// In which direction the camera is relative to the scene
		this._CameraDirection = cameraDirection;

		this._Experience = new Experience();
		this._Experience.on('ready', () => {
			// Get 3D Camera
			this._Camera = this._Experience.World.Camera;
			// Get scene
			this._Scene = this._Experience.World.MeshScenes[sceneName];

			// Boundingbox helper
			if (Slide3dBehavior.Debug) {
				const helper = new THREE.Box3Helper(this._BoundingBox, new THREE.Color(0xff0000));
				this._Experience.World.Scene.add(helper);
			}

			this.onExperienceReady();
		});
	}

	protected onExperienceReady() {}


	/**
	 * This function will find the distance in a direction where the 3D box is fully in the fov of the camera
	 * @param {Box3} fbox The focus box
	 * @param {Vector3} direction The direction of the camera
	 * @return {Vector3} The position of the camera
	 */
	protected GetCameraPositionToFocusBox(fbox: THREE.Box3, direction: THREE.Vector3): THREE.Vector3
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

export default Slide3dBehavior;