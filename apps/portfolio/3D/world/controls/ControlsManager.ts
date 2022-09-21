import * as THREE from 'three';

import Camera from "../Camera";
import ControlShakeStep from './ControlShakeStep';
import ControlSteps from "./ControlSteps";
import ControlTransitionStep from "./ControlTransitionStep";

class Control
{
	// Quick access
	private _Camera: Camera;

	// Own properties
	private _ControlSteps: ControlSteps[];
	private _StepIndex: number;

	constructor(InCamera: Camera)
	{
		this._Camera = InCamera;

		this._Camera.MoveTo(0, 5, 8, true);
		this._Camera.RotateTo(new THREE.Quaternion(), true);
		this._ControlSteps = [
			new ControlShakeStep(InCamera, new THREE.Vector3(-1.5, 5, 0), new THREE.Vector2(1.5, 0.5)), // UVCH
			new ControlTransitionStep(InCamera, [
				new THREE.Vector3(0, 5, 8),
				new THREE.Vector3(0, 0, 8),
			], 0.025),
			new ControlShakeStep(InCamera, new THREE.Vector3(-1.5, 0, 0), new THREE.Vector2(1.5, 0.5)), // HugoMeet
			new ControlTransitionStep(InCamera, [
				new THREE.Vector3(0, 0, 8),
				new THREE.Vector3(0, -3, 8),
			], 0.025),
			new ControlShakeStep(InCamera, new THREE.Vector3(-1.5, -5, 0), new THREE.Vector2(1.5, 0.5)), // Terrain Generator
		];
		this._StepIndex = 0;

		this.ChangeStep(0);
	}

	public Update()
	{
		const currentStep = this._ControlSteps[this._StepIndex];

		// update current control step
		currentStep.Update();

		if (currentStep.IsFinish() && this._StepIndex < this._ControlSteps.length - 1)
		{
			// if current step is finish, go to next step
			this.ChangeStep(+1);
		}
	}

	private ChangeStep(direction: number /* -1 or 1 */)
	{
		const currentStep = this._ControlSteps[this._StepIndex + direction];
		if (currentStep) {
			this._StepIndex += direction;

			currentStep.Start();
		}
	}
}

export default Control;