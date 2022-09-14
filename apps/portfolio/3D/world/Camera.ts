import * as THREE from 'three';

import Canvas3D from "../Canvas3D";
import Sizes from '@3D/utils/Sizes';
import Control from './Controls';

export interface ILerp3d {
	current: THREE.Vector3,
	target: THREE.Vector3,
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

	private _PositionLerp: ILerp3d = { current: new THREE.Vector3(0), target: new THREE.Vector3(0), speed: 0.05 };
	private _RotationLerp: ILerp3d = { current: new THREE.Vector3(0), target: new THREE.Vector3(0), speed: 0.05 };

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
		this._Scene.add(this._PerspectiveCamera);

		// Init controls
		this._Controls = new Control(this);
	}

	public Resize()
	{
		this._PerspectiveCamera.aspect = this._Sizes.Aspect;
		this._PerspectiveCamera.updateProjectionMatrix();
	}

	public Update()
	{

		this._PositionLerp.current.lerp(this._PositionLerp.target, this._PositionLerp.speed);
		this._RotationLerp.current.lerp(this._RotationLerp.target, this._RotationLerp.speed);

		this._PerspectiveCamera.position.set(
			this._PositionLerp.current.x,
			this._PositionLerp.current.y,
			this._PositionLerp.current.z);
		this._PerspectiveCamera.rotation.set(
			this._RotationLerp.current.x,
			this._RotationLerp.current.y,
			this._RotationLerp.current.z);

		this._Controls.Update();
	}

	public MoveTo(x: number, y: number, z: number, teleport = false)
	{
		if (teleport) {
			this._PerspectiveCamera.position.set(x, y, z);
			this._PositionLerp.current.set(x, y, z);
		}
		this._PositionLerp.target.set(x, y, z);
	}

	public OffsetPosition(x: number, y: number, z: number, teleport = false)
	{
		this.MoveTo(
			this._PerspectiveCamera.position.x + x,
			this._PerspectiveCamera.position.y + y,
			this._PerspectiveCamera.position.z + z,
			teleport);
	}

	public RotateTo(x: number, y: number, z: number, teleport = false)
	{
		// Convert to radians
		x = THREE.MathUtils.degToRad(x);
		y = THREE.MathUtils.degToRad(y);
		z = THREE.MathUtils.degToRad(z);

		if (teleport) {
			this._PerspectiveCamera.rotation.set(x, y, z);
			this._RotationLerp.current.set(x, y, z);
		}
		this._RotationLerp.target.set(x, y, z);
	}

	public OffsetRotation(x: number, y: number, z: number, teleport = false)
	{
		this.RotateTo(
			this._PerspectiveCamera.rotation.x + x,
			this._PerspectiveCamera.rotation.y + y,
			this._PerspectiveCamera.rotation.z + z,
			teleport);
	}
}

export default Camera;