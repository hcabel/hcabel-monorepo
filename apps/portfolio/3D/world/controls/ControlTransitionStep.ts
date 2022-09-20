import * as THREE from 'three';
import Camera from '../Camera';

import ControlSteps from './ControlSteps';

class ControlTransitionStep extends ControlSteps {
	// Own properties
	private _TransitionPath: THREE.CatmullRomCurve3;
	private _Progress: number;

	constructor(InCamera: Camera, InTransitionPath: THREE.Vector3[])
	{
		super(InCamera);

		if (InTransitionPath.length < 2) {
			throw new Error("Transition path must have at least 2 points");
		}
		this._TransitionPath = new THREE.CatmullRomCurve3(InTransitionPath);
		this._Progress = 0;
	}

	public Start()
	{
		// Add camera postion at first to make a seamless transition
		this._TransitionPath = new THREE.CatmullRomCurve3([
			this._Camera.PerspectiveCamera.position,
			...this._TransitionPath.points
		]);
	}

	public Update()
	{
		// update progress and clamp it
		this._Progress = Math.min(this._Progress + 0.01, 1);

		// update camera rotation
		this._Camera.LookAt(new THREE.Vector3(0, 0, 1));
	}

	public GetPosition(): THREE.Vector3
	{
		return this._TransitionPath.getPointAt(this._Progress);
	}

	public IsFinish(): boolean
	{
		return this._Progress === 1;
	}

}

export default ControlTransitionStep;