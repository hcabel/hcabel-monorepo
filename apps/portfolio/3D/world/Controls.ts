import Canvas3D from '@3D/Canvas3D';
import * as THREE from 'three';

import Camera from "./Camera";

class Level {
	private _Curve: THREE.CurvePath<THREE.Vector3>;
	private _LookAt: THREE.CurvePath<THREE.Vector3>;
	private _Progress: number;

	get Curve(): THREE.CurvePath<THREE.Vector3> { return this._Curve; }
	get LookAt(): THREE.CurvePath<THREE.Vector3> { return this._LookAt; }
	get Progress(): number { return this._Progress; }

	constructor(InCurve: THREE.CurvePath<THREE.Vector3>, InLookAt: THREE.CurvePath<THREE.Vector3>, InProgress = 0)
	{
		this._Curve = InCurve;
		this._LookAt = InLookAt;
		this._Progress = THREE.MathUtils.clamp(InProgress, 0, 1);

		// this.ShowDebug();
	}

	private ShowDebug()
	{
		const bufferGeometry = new THREE.BufferGeometry().setFromPoints(this._Curve.getPoints(10));
		const curveObject = new THREE.Line(bufferGeometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
		new Canvas3D().World.Scene.add(curveObject);

		// Debug lookAt
		const bufferGeometry2 = new THREE.BufferGeometry().setFromPoints(this._LookAt.getPoints(10));
		const curveObject2 = new THREE.Line(bufferGeometry2, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
		new Canvas3D().World.Scene.add(curveObject2);
	}

	public SetProgress(value: number) { this._Progress = value; }
	public UpdateProgress(value: number) {
		if (value > 0) {
			this._Progress = Math.max(0, this._Progress) + value;
		}
		else {
			this._Progress = Math.min(1, this._Progress) + value;
		}
	}
	public GetProgressLocation(): THREE.Vector3 { return this._Curve.getPoint(THREE.MathUtils.clamp(this._Progress, 0, 1)); }
	public GetProgressLookAt(): THREE.Vector3 { return this._LookAt.getPoint(THREE.MathUtils.clamp(this._Progress, 0, 1)); }
}

class Control
{
	// Quick access
	private _Camera: Camera;

	// Own properties
	private _CurrentLevel: number;
	private _Levels: Level[];
	private _InTransition: boolean;
	private _TransitionLevelStart: number;
	private _TransitionLevelEnd: number;

	constructor(InCamera: Camera)
	{
		this._Camera = InCamera;

		const distance = 3;
		this._Levels = [
			new Level( // Level 3
				new THREE.CatmullRomCurve3([
					new THREE.Vector3(0, 2, -distance),
					new THREE.Vector3(distance * 0.75, 2, -distance * 0.75),
					new THREE.Vector3(distance, 2, 0),
				]),
				new THREE.CatmullRomCurve3([
					new THREE.Vector3(0.5, 1.5, -0.5),
					new THREE.Vector3(0.5, 1.5, -0.5),
				]),
			),
			new Level( // Transition Level 3 <---> Level 2
				new THREE.CatmullRomCurve3([
					new THREE.Vector3(distance, 2, 0),
					new THREE.Vector3(distance, 1.7, distance),
					new THREE.Vector3(0, 1.4, distance)
				]),
				new THREE.CatmullRomCurve3([ // Interpolate LookAt between Level 3 and Level 2
					new THREE.Vector3(0.5, 1.5, -0.5),
					new THREE.Vector3(-0.5, 0.9, 0.5),
				]),
			),
			new Level( // Level 2
				new THREE.CatmullRomCurve3([
					new THREE.Vector3(0, 1.4, distance),
					new THREE.Vector3(-distance * 0.75, 1.4, distance * 0.75),
					new THREE.Vector3(-distance, 1.4, 0),
				]),
				new THREE.CatmullRomCurve3([
					new THREE.Vector3(-0.5, 0.9, 0.5),
					new THREE.Vector3(-0.5, 0.9, 0.5),
				]),
			),
			new Level( // Transition Level 2 <---> Level 1
				new THREE.CatmullRomCurve3([
					new THREE.Vector3(-distance, 1.4, 0),
					new THREE.Vector3(-distance, 1.1, -distance),
					new THREE.Vector3(0, 0.8, -distance),
				]),
				new THREE.CatmullRomCurve3([
					new THREE.Vector3(-0.5, 0.9, 0.5),
					new THREE.Vector3(0.5, 0.3, -0.5),
				]),
			),
			new Level( // Level 1
				new THREE.CatmullRomCurve3([
					new THREE.Vector3(0, 0.8, -distance),
					new THREE.Vector3(distance * 0.75, 0.8, -distance * 0.75),
					new THREE.Vector3(distance, 0.8, 0),
				]),
				new THREE.CatmullRomCurve3([
					new THREE.Vector3(0.5, 0.3, -0.5),
					new THREE.Vector3(0.5, 0.3, -0.5),
				]),
			)
		]
		this._CurrentLevel = 0;
		this._InTransition = false;

		window.onwheel = (e: WheelEvent) => {
			if (this._InTransition) {
				return;
			}
			const offset = THREE.MathUtils.clamp(e.deltaY, -50, 50) * 0.001;

			// Update progress in current level
			const level = this._Levels[this._CurrentLevel];
			level.UpdateProgress(offset);

			// Move to next/previous level if we exceed the threshold
			const threshold = 0.25;
			if (level.Progress > 1 + threshold && this._CurrentLevel < this._Levels.length - 1) {
				this._InTransition = true;
				this._TransitionLevelStart = this._CurrentLevel;
				this._TransitionLevelEnd = this._CurrentLevel + 2; // +2 because we skip the transition level
				this._CurrentLevel += 1;
				this._Levels[this._CurrentLevel].SetProgress(0);
			}
			else if (level.Progress < -threshold && this._CurrentLevel > 0) {
				this._InTransition = true;
				this._TransitionLevelStart = this._CurrentLevel;
				this._TransitionLevelEnd = this._CurrentLevel - 2; // +2 because we skip the transition level
				this._CurrentLevel -= 1
				this._Levels[this._CurrentLevel].SetProgress(1);
			}
		}
	}

	public Update()
	{
		if (this._InTransition == false) {
			// Update cam position
			const level = this._Levels[this._CurrentLevel];
			const position = level.GetProgressLocation();
			this._Camera.MoveTo(position.x, position.y, position.z);

			// Update cam rotation
			const lookAt = level.GetProgressLookAt();
			this._Camera.PerspectiveCamera.lookAt(lookAt.x, lookAt.y, lookAt.z);
		}
		else {
			// Update cam position
			const level = this._Levels[this._CurrentLevel];
			const position = level.GetProgressLocation();
			this._Camera.MoveTo(position.x, position.y, position.z);

			level.UpdateProgress(this._TransitionLevelStart < this._TransitionLevelEnd ? 0.025 : -0.025);

			if (level.Progress > 1) {
				this._InTransition = false;
				this._CurrentLevel += 1;
				this._Levels[this._CurrentLevel].SetProgress(0);
			}
			else if (level.Progress < 0) {
				this._InTransition = false;
				this._CurrentLevel -= 1;
				this._Levels[this._CurrentLevel].SetProgress(1);
			}

			// Update cam rotation
			const lookAt = level.GetProgressLookAt();
			console.log(1000, lookAt);
			this._Camera.PerspectiveCamera.lookAt(lookAt.x, lookAt.y, lookAt.z);
		}
	}
}

export default Control;