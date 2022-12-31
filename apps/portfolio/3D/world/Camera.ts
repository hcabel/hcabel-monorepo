import * as THREE from 'three';

import Sizes from '3D/utils/Sizes';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Experience from '3D/Experience';

export interface ICameraPosition {
	start: THREE.Vector3,
	end: THREE.Vector3,
	speed: number,
	progress: number,
}

export interface ICameraRotation {
	start: THREE.Quaternion,
	end: THREE.Quaternion,
	speed: number,
	progress: number,
	isFocus: boolean,
	focusPoint: THREE.Vector3,
}

class Camera
{
	// Quick access
	private _Sizes: Sizes;
	private _Scene: THREE.Scene;

	// Own properties
	private _PerspectiveCamera: THREE.PerspectiveCamera;
	private _Position: ICameraPosition
		= { start: new THREE.Vector3(0), end: new THREE.Vector3(0), speed: 0.05, progress: 0 };
	private _Rotation: ICameraRotation
		= { start: new THREE.Quaternion(0), end: new THREE.Quaternion(0), speed: 0.05, progress: 0, isFocus: false, focusPoint: new THREE.Vector3(0) };
	private _OrbitControls: OrbitControls | undefined;
	private _IsInAnimation: boolean = false;

	// Own properties getters
	get PerspectiveCamera(): THREE.PerspectiveCamera { return this._PerspectiveCamera; }
	get Position(): THREE.Vector3 { return this._PerspectiveCamera.position; }

	constructor(InScene: THREE.Scene)
	{
		const experience = new Experience();
		this._Sizes = experience.Sizes;
		this._Scene = InScene;

		this.InitPerspectiveCamera();
	}

	private InitPerspectiveCamera()
	{
		// Init cam
		this._PerspectiveCamera = new THREE.PerspectiveCamera(
			35,
			this._Sizes.Aspect,
			0.1,
			1000);
		this.MoveTo(0, 0, 0, true);
		this.RotateTo(new THREE.Quaternion(), true);
		this._Scene.add(this._PerspectiveCamera);

		// Init OrbitControls
		// this._OrbitControls = new OrbitControls(this._PerspectiveCamera, document.getElementById('HtmlPageContent'));
		if (this._OrbitControls) {
			this._OrbitControls.enableDamping = true;
			this._OrbitControls.dampingFactor = 0.01;
			this._OrbitControls.enableZoom = true;
		}
	}

	public Resize()
	{
		this._PerspectiveCamera.aspect = this._Sizes.Aspect;
		this._PerspectiveCamera.updateProjectionMatrix();
	}

	public Update()
	{
		if (this._OrbitControls) {
			this._OrbitControls.update();
			console.log(this._PerspectiveCamera.position);
			return;
		}

		this.UpdatePosition();
		this.UpdateRotation();

		if (this._IsInAnimation && this._Position.progress >= 1 && this._Rotation.progress >= 1) {
			this._IsInAnimation = false;
		}
	}

	/* ANIMATION *************************************************************/

	public CancelAnimation()
	{
		this._IsInAnimation = false;
		this._Position.progress = 1;
		this._Rotation.progress = 1;
		this._Rotation.isFocus = false;
	}

	public AnimatesTo(InPosition: THREE.Vector3, InRotation: THREE.Quaternion, speed = 0.05)
	{
		this._IsInAnimation = true;

		this._Position.start.copy(this._PerspectiveCamera.position);
		this._Position.end.copy(InPosition);
		this._Position.progress = 0;
		this._Position.speed = speed;

		this._Rotation.start.copy(this._PerspectiveCamera.quaternion);
		this._Rotation.end.copy(InRotation);
		this._Rotation.progress = 0;
		this._Rotation.speed = speed;
	}

	public AnimatesToWhileFocusing(InPosition: THREE.Vector3, InFocusPoint: THREE.Vector3, speed = 0.05)
	{
		this._Position.start.copy(this._PerspectiveCamera.position);
		this._Position.end.copy(InPosition);
		this._Position.progress = 0;
		this._Position.speed = speed;

		this.Focus(InFocusPoint, false, speed);

		this._IsInAnimation = true;
	}

	/* LOCATION **************************************************************/

	private UpdatePosition()
	{
		if (this._Position.progress < 1) {
			// Update progress
			this._Position.progress += this._Position.speed;

			// lerp between start and end
			this._PerspectiveCamera.position.lerpVectors(
				this._Position.start,
				this._Position.end,
				this._Position.progress);
		}
	}

	public MoveTo(x: number, y: number, z: number, teleport = false, speed = 0.05)
	{
		if (this._IsInAnimation) {
			this._Position.end.set(x, y, z);
			return;
		}

		// if too target to close, teleport
		teleport = teleport || this._PerspectiveCamera.position.distanceTo(new THREE.Vector3(x, y, z)) < 0.1;

		if (teleport) {
			this._Position.progress = 1;
			this._Position.start.set(x, y, z);
			this._Position.end.set(x, y, z);
			this._PerspectiveCamera.position.set(x, y, z);
		}
		else {
			this._Position.speed = speed;
			this._Position.progress = 0;
			this._Position.start.copy(this._PerspectiveCamera.position);
			this._Position.end.set(x, y, z);
		}
	}

	public MoveToVector3(pos: THREE.Vector3, teleport = false)
	{
		if (this._IsInAnimation) {
			return;
		}

		this.MoveTo(pos.x, pos.y, pos.z, teleport);
	}

	public OffsetPosition(x: number, y = 0, z = 0, teleport = false)
	{
		if (this._IsInAnimation) {
			return;
		}

		this.MoveTo(
			this._PerspectiveCamera.position.x + x,
			this._PerspectiveCamera.position.y + y,
			this._PerspectiveCamera.position.z + z,
			teleport);
	}

	/* ROTATION **************************************************************/

	private	UpdateRotation()
	{
		if (this._Rotation.isFocus) {
			// When focusing were animating the rotation until the camera reach the focus point
			if (this._Rotation.progress >= 1) {
				this._PerspectiveCamera.lookAt(this._Rotation.focusPoint);
			}
			else {
				// Update progress
				this._Rotation.progress += this._Rotation.speed;

				// Find end rotation to look at focus point without rolling
				// Were doing it every time in case the camera is moving
				this._Rotation.end = new THREE.Quaternion()
					.setFromRotationMatrix(
						new THREE.Matrix4().lookAt(
							this._PerspectiveCamera.position,
							this._Rotation.focusPoint,
							new THREE.Vector3(0, 1, 0)
						)
					);

				// lerp between start and end
				this._PerspectiveCamera.quaternion.slerpQuaternions(
					this._Rotation.start,
					this._Rotation.end,
					this._Rotation.progress);
			}
		}
		else if (this._Rotation.progress < 1) {
			// Update progress
			this._Rotation.progress += this._Rotation.speed;

			// lerp between start and end
			this._PerspectiveCamera.quaternion.slerpQuaternions(
				this._Rotation.start,
				this._Rotation.end,
				this._Rotation.progress);
		}
	}

	public Unfocus()
	{
		if (this._IsInAnimation) {
			return;
		}

		this._Rotation.isFocus = false;
	}

	public Focus(focusPoint: THREE.Vector3, teleport = false, speed = 0.05)
	{
		if (this._IsInAnimation) {
			return;
		}

		this._Rotation.isFocus = true;
		this._Rotation.focusPoint = focusPoint;
		this._Rotation.progress = teleport ? 1 : 0;
		this._Rotation.start = this._PerspectiveCamera.quaternion.clone();
		this._Rotation.speed = speed;
	}

	public RotateTo(rot: THREE.Quaternion, teleport = false, speed = 0.05)
	{
		if (this._IsInAnimation) {
			return;
		}

		if (teleport) {
			this._Rotation.progress = 1;
			this._Rotation.start.copy(rot);
			this._Rotation.end.copy(rot);
			this._PerspectiveCamera.quaternion.copy(rot);
		}
		else {
			this._Rotation.speed = speed;
			this._Rotation.progress = 0;
			this._Rotation.start.copy(this._PerspectiveCamera.quaternion);
			this._Rotation.end.copy(rot);
		}
	}

	public LookAt(target: THREE.Vector3, teleport = false)
	{
		if (this._IsInAnimation) {
			return;
		}

		const rot = new THREE.Euler();
		rot.setFromRotationMatrix(
			new THREE.Matrix4()
				.lookAt(
					this._PerspectiveCamera.position,
					target,
					new THREE.Vector3(0, 1, 0)));

		this.RotateTo(new THREE.Quaternion().setFromEuler(rot), teleport);
	}
}

export default Camera;