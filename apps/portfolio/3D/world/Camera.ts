import * as THREE from 'three';

import Canvas3D from '3D/Canvas3D';
import Sizes from '3D/utils/Sizes';
import Control from '3D/world/Controls';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export interface ILerp3d {
	current: THREE.Vector3,
	target: THREE.Vector3,
	speed: number,
}

export interface ILerpQuad {
	current: THREE.Quaternion,
	target: THREE.Quaternion,
	speed: number,
}

class Camera {
	// Quick access
	private _Canvas3D: Canvas3D;
	private _Sizes: Sizes;
	private _Scene: THREE.Scene;

	// Own properties
	private _PerspectiveCamera: THREE.PerspectiveCamera;
	private _Controls: Control;

	private _PositionLerp: ILerp3d = { current: new THREE.Vector3(0), target: new THREE.Vector3(0), speed: 0.25 };
	private _RotationLerp: ILerpQuad = { current: new THREE.Quaternion(0), target: new THREE.Quaternion(0), speed: 0.25 };

	private _OrbitControls: OrbitControls | undefined;

	// Own properties getters
	get PerspectiveCamera(): THREE.PerspectiveCamera { return this._PerspectiveCamera; }

	constructor()
	{
		this._Canvas3D = new Canvas3D();
		this._Sizes = this._Canvas3D.Sizes;
		this._Scene = this._Canvas3D.World.Scene;

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
		this._PerspectiveCamera.position.set(0, 0, 0);
		this._PerspectiveCamera.rotation.set(0, 0, 0);
		this._Scene.add(this._PerspectiveCamera);

		// Init controls
		this._Controls = new Control(this);

		// Init OrbitControls
		// this._OrbitControls = new OrbitControls(this._PerspectiveCamera, this._Canvas3D.Canvas);
		if (this._OrbitControls) {
			this._OrbitControls.enableDamping = true;
			this._OrbitControls.dampingFactor = 0.05;
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
			return;
		}

		// Update smooth position
		this._PositionLerp.current.lerp(this._PositionLerp.target, this._PositionLerp.speed);
		if (this._PositionLerp.current.distanceTo(this._PositionLerp.target) < 0.01) {
			this._PositionLerp.current.copy(this._PositionLerp.target);
		}
		this._PerspectiveCamera.position.copy(this._PositionLerp.current);

		// Update smooth rotation
		this._RotationLerp.current.slerp(this._RotationLerp.target, this._RotationLerp.speed);
		this._PerspectiveCamera.rotation.setFromQuaternion(this._RotationLerp.current);
	}

	/* LOCATION **************************************************************/

	public MoveTo(x: number, y: number, z: number, teleport = false)
	{
		if (teleport) {
			this._PerspectiveCamera.position.set(x, y, z);
			this._PositionLerp.current.set(x, y, z);
		}
		this._PositionLerp.target.set(x, y, z);
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

	public RotateTo(rot: THREE.Quaternion, teleport = false)
	{
		if (teleport) {
			this._PerspectiveCamera.rotation.setFromQuaternion(rot);
			this._RotationLerp.current.copy(rot);
		}
		this._RotationLerp.target.copy(rot);
	}

	public LookAt(target: THREE.Vector3)
	{
		const rot = new THREE.Euler();
		rot.setFromRotationMatrix(
			new THREE.Matrix4()
				.lookAt(
					this._PerspectiveCamera.position,
					target,
					new THREE.Vector3(0, 1, 0)));

		this.RotateTo(new THREE.Quaternion().setFromEuler(rot));
	}
}

export default Camera;