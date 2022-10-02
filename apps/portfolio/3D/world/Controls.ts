import * as THREE from 'three';

import Camera from '3D/world/Camera';

import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import GSAP from 'gsap';
import Canvas3D from '3D/Canvas3D';

class Controls
{
	public static _ProjectFocusBoxSize = new THREE.Vector3(3.5, 3.5, 3.5);

	// Quick access
	protected _Camera: Camera;

	// Own properties
	protected _ScrollTrigger: ScrollTrigger;

	constructor(InCamera: Camera)
	{
		this._Camera = InCamera;

		// Set start camera position
		this._Camera.MoveTo(0, 5, 8, true);
		this._Camera.RotateTo(new THREE.Quaternion(), true);

		this.CreateScrollTrigger();
		this.Resize();
	}

	protected CreateScrollTrigger(debug = false)
	{
		// Register ScrollTrigger to navigate between UVCH and HugoMeet
		GSAP.registerPlugin(ScrollTrigger);
		this._ScrollTrigger = ScrollTrigger.create({
			trigger: '#HtmlGridContent',
			markers: debug,
			start: 'top top',
			end: 'bottom bottom',
			onUpdate: (e: ScrollTrigger) => {
				this._Camera.MoveTo(
					this._Camera.PerspectiveCamera.position.x,
					5 - (e.progress * 10),
					this._Camera.PerspectiveCamera.position.z
				);
			}
		});
	}

	public Resize()
	{
		// calculate z depth to fit project in viewport
		const z = this.GetFocusZDistance();

		// calculate x position where the cube should be in the middle of the screen on mobile and on the left on desktop
		const x = window.innerWidth > 920 ? this.GetXFocusDistance(z) : 0;

		// Move camera to new location
		this._Camera.MoveTo(x, this._Camera.PerspectiveCamera.position.y, z, true);
		this._ScrollTrigger.refresh();
	}

	/**
	 * This function will calculate the z distance of the camera from the focusBoxSize
	 * @returns z distance to fit project in viewport
	 */
	private GetFocusZDistance(): number
	{
		const objectSizes: THREE.Vector3 = Controls._ProjectFocusBoxSize;
		const objectSize = Math.max(objectSizes.x, objectSizes.y, objectSizes.z);

		const cameraFov = this._Camera.PerspectiveCamera.fov;
		const heigthCameraView = 2.0 * Math.tan(THREE.MathUtils.degToRad(cameraFov / 2));
		let distanceHeigth = objectSize / heigthCameraView;
		distanceHeigth += objectSize / 2;

		const widthCameraView = heigthCameraView * this._Camera.PerspectiveCamera.aspect;
		let distanceWidth = objectSize / widthCameraView;
		distanceWidth += objectSize / 2;

		return (Math.max(distanceWidth, distanceHeigth));
	}

	private GetXFocusDistance(zDepthDistance: number): number
	{
		const objectSizes: THREE.Vector3 = Controls._ProjectFocusBoxSize;
		const objectSize = Math.max(objectSizes.x, objectSizes.y, objectSizes.z);

		const cameraFov = this._Camera.PerspectiveCamera.fov;
		const heigthCameraView = 2.0 * Math.tan(THREE.MathUtils.degToRad(cameraFov / 2));
		const widthCameraView = heigthCameraView * this._Camera.PerspectiveCamera.aspect;

		const distanceToProject = zDepthDistance - objectSize / 2;
		const distanceToWindowRightEdge = -(widthCameraView * distanceToProject) / 2;

		return (distanceToWindowRightEdge + objectSize / 2);
	}
}

// Export this class has default for additional debug information
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ControlsDebug extends Controls
{
	constructor(InCamera: Camera)
	{
		super(InCamera);

		// kill previous scroll trigger to create a new one with markers on
		this._ScrollTrigger.kill();
		this.CreateScrollTrigger(true);

		for (const y of [5, 0, -5]) {
			// Create debug cube at y pos, from size = this._ProjectFocusBoxSize
			const cube = new THREE.Mesh(
				new THREE.BoxGeometry(Controls._ProjectFocusBoxSize.x, Controls._ProjectFocusBoxSize.y, Controls._ProjectFocusBoxSize.z),
				new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
			);
			cube.position.set(0, y, 0);
			new Canvas3D().World.Scene.add(cube);
		}
	}
}

export default Controls;