import * as THREE from 'three';

import Sizes from '3D/utils/Sizes';
import Control from '3D/world/controls/Controls';

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
	private _Controls: Control;
	private _Position: ICameraPosition
		= { start: new THREE.Vector3(0), end: new THREE.Vector3(0), speed: 0.25, progress: 0 };
	private _Rotation: ICameraRotation
		= { start: new THREE.Quaternion(0), end: new THREE.Quaternion(0), speed: 0.25, progress: 0, isFocus: false, focusPoint: new THREE.Vector3(0) };
	private _OrbitControls: OrbitControls | undefined;

	// Own properties getters
	get PerspectiveCamera(): THREE.PerspectiveCamera { return this._PerspectiveCamera; }
	get Controls(): Control { return this._Controls; }

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

		// Init controls
		this._Controls = new Control(this);

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

		if (!this._OrbitControls) {
			this._Controls.Resize();
		}
	}

	public Update()
	{
		if (this._OrbitControls) {
			this._OrbitControls.update();
			console.log(this._PerspectiveCamera.position);
			return;
		}

		this._Controls.Update();

		this.UpdatePosition();
		this.UpdateRotation();
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

			// if (this._Position.progress >= 1) {
			// 	console.log('Camera position lerp done', this._PerspectiveCamera.position);
			// }
		}
	}

	public MoveTo(x: number, y: number, z: number, teleport = false)
	{
		if (teleport) {
			this._Position.progress = 1;
			this._Position.start.set(x, y, z);
			this._Position.end.set(x, y, z);
			this._PerspectiveCamera.position.set(x, y, z);
		}
		else {
			this._Position.progress = 0;
			this._Position.start.copy(this._PerspectiveCamera.position);
			this._Position.end.set(x, y, z);
		}
	}

	public MoveToVector3(pos: THREE.Vector3, teleport = false)
	{
		this.MoveTo(pos.x, pos.y, pos.z, teleport);
	}

	public OffsetPosition(x: number, y = 0, z = 0, teleport = false)
	{
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
			this._PerspectiveCamera.lookAt(this._Rotation.focusPoint);
		}
		else if (this._Rotation.progress < 1) {
			// Update progress
			this._Rotation.progress += this._Rotation.speed;

			// lerp between start and end
			this._PerspectiveCamera.quaternion.slerpQuaternions(
				this._Rotation.start,
				this._Rotation.end,
				this._Rotation.progress);

			if (this._Rotation.progress >= 1) {
				console.log('Camera rotation lerp done',
					this._PerspectiveCamera.quaternion.x * 100,
					this._PerspectiveCamera.quaternion.y * 100,
					this._PerspectiveCamera.quaternion.z * 100,
					this._PerspectiveCamera.quaternion.w * 100);
			}
		}
	}

	public Unfocus()
	{
		this._Rotation.isFocus = false;
	}

	public Focus(focusPoint: THREE.Vector3)
	{
		this._Rotation.isFocus = true;
		this._Rotation.focusPoint = focusPoint;
	}

	public RotateTo(rot: THREE.Quaternion, teleport = false)
	{
		if (teleport) {
			this._Rotation.progress = 1;
			this._Rotation.start.copy(rot);
			this._Rotation.end.copy(rot);
			this._PerspectiveCamera.quaternion.copy(rot);
		}
		else {
			this._Rotation.progress = 0;
			this._Rotation.start.copy(this._PerspectiveCamera.quaternion);
			this._Rotation.end.copy(rot);
		}
	}

	public LookAt(target: THREE.Vector3, teleport = false)
	{
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