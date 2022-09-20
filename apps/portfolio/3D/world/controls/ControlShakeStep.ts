import * as THREE from 'three';
import Camera from '../Camera';

import ControlSteps from './ControlSteps';

class ControlShakeStep extends ControlSteps
{
	// Own properties
	private _StartPosition: THREE.Vector3;
	private _NewPosition: THREE.Vector3;
	private _TargetPoint: THREE.Vector3;
	private _MaxDistance: THREE.Vector2;
	private _IsFinish: boolean;

	constructor(InCamera: Camera, InTarget: THREE.Vector3, InMaxDistance: THREE.Vector2)
	{
		super(InCamera);

		this._TargetPoint = InTarget;
		this._MaxDistance = InMaxDistance;

		this._NewPosition = new THREE.Vector3();
		this._StartPosition = new THREE.Vector3();
		this._IsFinish = false;
	}

	public Start()
	{
		this._StartPosition = this._Camera.PerspectiveCamera.position.clone();
		this._NewPosition = this._StartPosition.clone();

		// On mouse move, change camera position
		window.addEventListener('mousemove', (event: MouseEvent) => {
			// Get mouse position
			const x = event.clientX / window.innerWidth * 2 - 1;
			const y = event.clientY / window.innerHeight * 2 - 1;

			// Get camera position
			this._NewPosition.x = this._StartPosition.x + x * this._MaxDistance.x;
			this._NewPosition.y = this._StartPosition.y + y * this._MaxDistance.y;
			this._NewPosition.z = this._StartPosition.z;

			// Update camera
			this._Camera.RotateTo(new THREE.Quaternion().setFromEuler(this.GetRotation()));
			this._Camera.MoveTo(this._NewPosition.x, this._NewPosition.y, this._NewPosition.z);
		});

		// add event on keypress
		window.addEventListener('keypress', (event: KeyboardEvent) => {
			console.log(event.key);
			if (event.key === ' ') {
				this._IsFinish = true;
			}
		});

		this._Camera.MoveToVector3(this.GetPosition());
	}

	public Update()
	{
		// @TODO: Check if finish
	}

	public GetPosition(): THREE.Vector3
	{
		return this._NewPosition;
	}

	public GetRotation(): THREE.Euler
	{
		const rot = new THREE.Euler();
		rot.setFromRotationMatrix(
			new THREE.Matrix4()
				.lookAt(
					this.GetPosition(),
					this._TargetPoint,
					new THREE.Vector3(0, 1, 0)));

		return rot;
	}

	public IsFinish(): boolean
	{
		return this._IsFinish;
	}
}

export default ControlShakeStep;
