import * as THREE from 'three';

import Camera from "../Camera";

class ControlSteps {
	// Quick access
	protected _Camera: Camera;

	// Own properties

	constructor(InCamera: Camera)
	{
		this._Camera = InCamera;
	}

	public Start()
	{
		console.warn("ControlSteps: 'Start' function Not implemented");
		return;
	}

	public Update()
	{
		console.warn("ControlSteps: 'Update' function Not implemented");
		return;
	}

	public GetPosition(): THREE.Vector3
	{
		return this._Camera.PerspectiveCamera.position;
	}

	public GetRotation(): THREE.Euler
	{
		return this._Camera.PerspectiveCamera.rotation;
	}

	public IsFinish(): boolean
	{
		console.warn("ControlSteps: 'IsFinish' function Not implemented");
		return false;
	}
}

export default ControlSteps;