
import * as THREE from 'three';

import Camera from "./Camera";

interface ILerp {
	current: THREE.Vector2,
	target: THREE.Vector2,
	speed: number,
}

class Control
{
	// Quick access
	private _Camera: Camera;

	private _PositionLerp: ILerp;
	private _StartRotation: THREE.Vector2 = { x: 0, y: -0.25 };
	private _StartLocation: THREE.Vector3 = { x: 5, y: 10, z: 0 };

	constructor(InCamera: Camera)
	{
		this._Camera = InCamera;

		this._PositionLerp = {
			current: { x: 0, y: 0 },
			target: { x: 0, y: 0 },
			speed: 0.05,
		};

		this._Camera.PerspectiveCamera.position.set(this._StartLocation.x, this._StartLocation.y, this._StartLocation.z);
		this._Camera.PerspectiveCamera.rotation.set(this._StartRotation.x, this._StartRotation.y, 0.0);

		// Listen to mouse pointer to animate camera
		window.onmousemove = (event: MouseEvent) => {
			const rotationX = (event.clientX - window.innerWidth / 2) * 2 / window.innerWidth;
			this._PositionLerp.target.x = rotationX;
			const rotationY = (event.clientY - window.innerHeight / 2) * 2 / window.innerHeight;
			this._PositionLerp.target.y = rotationY;
		};
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
		this._Camera.PerspectiveCamera.position.y = this._PositionLerp.current.y * 1 + this._StartLocation.y;
		this._Camera.PerspectiveCamera.position.x = this._PositionLerp.current.x * -1 + this._StartLocation.x;

		// Update cam rotation to focus the center of the scene
		this._Camera.PerspectiveCamera.lookAt(0, 1.5, 0);
	}
}

export default Control;