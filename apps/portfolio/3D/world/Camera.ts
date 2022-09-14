import * as THREE from 'three';

import Canvas3D from "../Canvas3D";
import Sizes from '@3D/utils/Sizes';

interface ILerp {
	current: THREE.Vector2,
	target: THREE.Vector2,
	speed: number,
}

class Camera {
	// Quick access
	private _Canvas3D: Canvas3D;
	private _Sizes: Sizes;
	private _Scene: THREE.Scene;

	// Own properties
	private _PerspectiveCamera: THREE.PerspectiveCamera;
	private _PositionLerp: ILerp;
	private _StartRotation: THREE.Vector2 = { x: 0, y: -0.25 };
	private _StartLocation: THREE.Vector3 = { x: 5, y: 10, z: 0 };

	// Own properties getters
	get PerspectiveCamera(): THREE.PerspectiveCamera { return this._PerspectiveCamera; }

	constructor()
	{
		this._Canvas3D = new Canvas3D();
		this._Sizes = this._Canvas3D.Sizes;
		this._Scene = this._Canvas3D.World.Scene;

		this._PositionLerp = {
			current: { x: 0, y: 0 },
			target: { x: 0, y: 0 },
			speed: 0.05,
		};

		this.InitPerspectiveCamera();
	}

	private InitPerspectiveCamera()
	{
		// Init cam
		this._PerspectiveCamera = new THREE.PerspectiveCamera(35, this._Sizes.Aspect, 0.1, 1000);
		this._PerspectiveCamera.position.set(this._StartLocation.x, this._StartLocation.y, this._StartLocation.z);
		this._PerspectiveCamera.rotation.set(this._StartRotation.x, this._StartRotation.y, 0.0);
		this._Scene.add(this._PerspectiveCamera);

		// Listen to mouse pointer to animate camera
		window.onmousemove = (event) => {
			const rotationX = (event.clientX - window.innerWidth / 2) * 2 / window.innerWidth;
			this._PositionLerp.target.x = rotationX;

			const rotationY = (event.clientY - window.innerHeight / 2) * 2 / window.innerHeight;
			this._PositionLerp.target.y = rotationY;
		};
	}

	public Resize()
	{
		this._PerspectiveCamera.aspect = this._Sizes.Aspect;
		this._PerspectiveCamera.updateProjectionMatrix();
	}

	public Update()
	{
		this._PositionLerp.current.x = THREE.MathUtils.lerp(
			this._PositionLerp.current.x,
			this._PositionLerp.target.x,
			this._PositionLerp.speed
		);
		this._PositionLerp.current.y = THREE.MathUtils.lerp(
			this._PositionLerp.current.y,
			this._PositionLerp.target.y,
			this._PositionLerp.speed
		);

		// Update cam position depending on mouse position
		this._PerspectiveCamera.position.y = this._PositionLerp.current.y * 1 + this._StartLocation.y;
		this._PerspectiveCamera.position.x = this._PositionLerp.current.x * -1 + this._StartLocation.x;

		// Update cam rotation to focus the center of the scene
		this._PerspectiveCamera.lookAt(0, 1.5, 0);
	}
}

export default Camera;