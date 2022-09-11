import * as THREE from 'three';

import Canvas3D from "./Canvas3D";
import Sizes from '@3D/utils/Sizes';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Vector2D {
	x: number,
	y: number
}
interface Vector3D extends Vector2D {
	z: number,
}

interface ILerp {
	current: Vector2D,
	target: Vector2D,
	speed: number,
}

class Camera {
	private _Canvas3D: Canvas3D;
	private _Canvas: HTMLCanvasElement;
	private _Sizes: Sizes;
	private _Scene: THREE.Scene;
	private _PerspectiveCamera: THREE.PerspectiveCamera;
	private _Controls: OrbitControls | undefined = undefined;
	private _RotationLerp: ILerp;

	private _OriginRotation: Vector2D = { x: 0, y: -0.25 };
	private _OriginLocation: Vector3D = { x: 0, y: 2.5, z: 3 };

	get PerspectiveCamera(): THREE.PerspectiveCamera { return this._PerspectiveCamera; }

	constructor()
	{
		this._Canvas3D = new Canvas3D();
		this._Canvas = this._Canvas3D.Canvas;
		this._Sizes = this._Canvas3D.Sizes;
		this._Scene = this._Canvas3D.Scene;

		this._RotationLerp = {
			current: { x: 0, y: 0 },
			target: { x: 0, y: 0 },
			speed: 0.05,
		};

		this.InitPerspectiveCamera();

	}

	private InitPerspectiveCamera()
	{
		this._PerspectiveCamera = new THREE.PerspectiveCamera(35, this._Sizes.Aspect, 0.1, 1000);
		this._Scene.add(this._PerspectiveCamera);
		this._PerspectiveCamera.position.set(this._OriginLocation.x, this._OriginLocation.y, this._OriginLocation.z);

		window.onmousemove = (event) => {
			const rotationX = (event.clientX - window.innerWidth / 2) * 2 / window.innerWidth;
			this._RotationLerp.target.x = rotationX;

			const rotationY = (event.clientY - window.innerHeight / 2) * 2 / window.innerHeight;
			this._RotationLerp.target.y = rotationY;
		};

		/* DEBUG */
		// this._Controls = new OrbitControls(this._PerspectiveCamera, this._Canvas);
		if (this._Controls) {
			this._Controls.enableDamping = true;
			this._Controls.zoom = true;
		}
		const grid = new THREE.GridHelper(10, 10);
		this._Scene.add(grid);
		const axis = new THREE.AxesHelper(5);
		this._Scene.add(axis);
	}

	public Resize()
	{
		this._PerspectiveCamera.aspect = this._Sizes.Aspect;
		this._PerspectiveCamera.updateProjectionMatrix();
	}

	public Update()
	{
		this._RotationLerp.current.x = THREE.MathUtils.lerp(
			this._RotationLerp.current.x,
			this._RotationLerp.target.x,
			this._RotationLerp.speed
		);
		this._RotationLerp.current.y = THREE.MathUtils.lerp(
			this._RotationLerp.current.y,
			this._RotationLerp.target.y,
			this._RotationLerp.speed
		);

		this._PerspectiveCamera.rotation.y = this._RotationLerp.current.x * -0.1 + this._OriginRotation.x;
		this._PerspectiveCamera.rotation.x = this._RotationLerp.current.y * -0.1 + this._OriginRotation.y;

		console.log([this._PerspectiveCamera.rotation.x, this._PerspectiveCamera.rotation.x]);

		if (this._Controls) {
			console.log(this._PerspectiveCamera.position);
			this._Controls.update();
		}
	}
}

export default Camera;