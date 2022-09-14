import Canvas3D from '@3D/Canvas3D';
import * as THREE from 'three';

import Camera from "./Camera";

class Control
{
	// Quick access
	private _Camera: Camera;

	private _Curve: THREE.CatmullRomCurve3;
	private _CurveProgress: number;

	constructor(InCamera: Camera)
	{
		this._Camera = InCamera;

		// Create curve
		const distance = 3;
		const Offset = .5;
		const levelY = [ 0.4 + Offset, 1 + Offset, 1.6 + Offset, 6 ];
		this._Curve = new THREE.CatmullRomCurve3([
			new THREE.Vector3(0, 6, 0),
			new THREE.Vector3(
				-distance * 1.5,
				levelY[2] + ((levelY[3] - levelY[2]) / 2),
				-distance * 1.5),
			new THREE.Vector3(
				distance,
				levelY[2],
				-distance), // Level 3
			new THREE.Vector3(
				distance * 1.5,
				levelY[1] + ((levelY[2] - levelY[1]) / 2),
				distance * 1.5),
			new THREE.Vector3(
				-distance,
				levelY[1],
				distance), // Level 2
			new THREE.Vector3(
				-distance * 1.5,
				levelY[0] + ((levelY[1] - levelY[0]) / 2),
				-distance * 1.5),
			new THREE.Vector3(
				distance,
				levelY[0],
				-distance), // Level 1
		]);
		this._CurveProgress = 0;
		// debug curve
		const bufferGeometry = new THREE.BufferGeometry().setFromPoints(this._Curve.getPoints(50));
		const curveObject = new THREE.Line(bufferGeometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
		new Canvas3D().World.Scene.add(curveObject);

		this._Camera.MoveTo(0, 6, 0, true);
		this._Camera.RotateTo(-90, 0, -90, true);

		window.onwheel = (e: WheelEvent) => {
			const offset = THREE.MathUtils.clamp(e.deltaY, -50, 50) * 0.0001;
			console.log(offset);
			this._CurveProgress = THREE.MathUtils.clamp(this._CurveProgress + offset, 0, 1);
			console.log(1, {
				x: this._Camera.PerspectiveCamera.position.x,
				y: this._Camera.PerspectiveCamera.position.y,
				z: this._Camera.PerspectiveCamera.position.z,
			});
		}
	}

	public Update()
	{
		// Update cam rotation to focus the center of the scene
		// this._Camera.PerspectiveCamera.lookAt(0, 1.5, 0);

		// Update cam position
		const position = this._Curve.getPointAt(this._CurveProgress);
		this._Camera.MoveTo(position.x, position.y, position.z, false);

		// Update cam rotation
		if (position.y) {

			this._Camera.PerspectiveCamera.lookAt(0, position.y - 1, 0);
		}
	}
}

export default Control;