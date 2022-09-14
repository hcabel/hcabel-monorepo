import Canvas3D from '@3D/Canvas3D';
import * as THREE from 'three';

import Camera from "./Camera";

class Level {
	private _Curve: THREE.CurvePath<THREE.Vector3>;
	private _LookAt: THREE.Vector3;
	private _Progress: number;

	get Curve(): THREE.CurvePath<THREE.Vector3> { return this._Curve; }
	get LookAt(): THREE.Vector3 { return this._LookAt; }
	get Progress(): number { return this._Progress; }

	constructor(curve: THREE.CurvePath<THREE.Vector3>, lookAt: THREE.Vector3, progress = 0)
	{
		this._Curve = curve;
		this._LookAt = lookAt;
		this._Progress = THREE.MathUtils.clamp(progress, 0, 1);

		this.ShowDebug();
	}

	private ShowDebug()
	{
		const bufferGeometry = new THREE.BufferGeometry().setFromPoints(this._Curve.getPoints(10));
		const curveObject = new THREE.Line(bufferGeometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
		new Canvas3D().World.Scene.add(curveObject);

		// Debug lookAt
		const lookAtSphere = new THREE.Mesh(
			new THREE.SphereGeometry(0.1, 32, 32),
			new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
		lookAtSphere.position.copy(this._LookAt);
		lookAtSphere.scale.set(0.1, 0.1, 0.1);
		new Canvas3D().World.Scene.add(lookAtSphere);
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
}

class Control
{
	// Quick access
	private _Camera: Camera;

	// private _Curve: THREE.CatmullRomCurve3;
	// private _CurveProgress: number;

	private _CurrentLevel: number;
	private _Levels: Level[];

	constructor(InCamera: Camera)
	{
		this._Camera = InCamera;

		const distance = 3;
		this._Levels = [
			new Level(
				new THREE.CatmullRomCurve3([
					new THREE.Vector3(0, 2, -distance),
					new THREE.Vector3(distance * 0.75, 2, -distance * 0.75),
					new THREE.Vector3(distance, 2, 0),
				]),
				new THREE.Vector3(0.5, 1.5, -0.5),
			),
			new Level(
				new THREE.CatmullRomCurve3([
					new THREE.Vector3(0, 1.4, distance),
					new THREE.Vector3(-distance * 0.75, 1.4, distance * 0.75),
					new THREE.Vector3(-distance, 1.4, 0),
				]),
				new THREE.Vector3(-0.5, .9, 0.5),
			),
			new Level(
				new THREE.CatmullRomCurve3([
					new THREE.Vector3(0, .8, -distance),
					new THREE.Vector3(distance * 0.75, .8, -distance * 0.75),
					new THREE.Vector3(distance, .8, 0),
				]),
				new THREE.Vector3(0.5, 0.3, -0.5),
			)
		]
		this._CurrentLevel = 0;

		window.onwheel = (e: WheelEvent) => {
			const offset = THREE.MathUtils.clamp(e.deltaY, -50, 50) * 0.001;

			// Update progress in current level
			const level = this._Levels[this._CurrentLevel];
			level.UpdateProgress(offset);

			// Move to next/previous level if we exceed the threshold
			const threshold = 0.25;
			if (level.Progress > 1 + threshold && this._CurrentLevel < this._Levels.length - 1) {
				this._CurrentLevel += 1;
				this._Levels[this._CurrentLevel].SetProgress(0);
			}
			else if (level.Progress < -threshold && this._CurrentLevel > 0) {
				this._CurrentLevel -= 1
				this._Levels[this._CurrentLevel].SetProgress(1);
			}
		}
	}

	public Update()
	{
		// Update cam position
		const level = this._Levels[this._CurrentLevel];
		const position = level.GetProgressLocation();
		this._Camera.MoveTo(position.x, position.y, position.z);

		// Update cam rotation
		this._Camera.PerspectiveCamera.lookAt(level.LookAt.x, level.LookAt.y, level.LookAt.z);
	}
}

export default Control;