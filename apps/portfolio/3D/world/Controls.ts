
import * as THREE from 'three';

import Camera from "./Camera";

class Control
{
	// Quick access
	private _Camera: Camera;

	constructor(InCamera: Camera)
	{
		this._Camera = InCamera;
		this._Camera.MoveTo(0, 6, 0, true);
		this._Camera.RotateTo(-90, 0, -90, true);

		window.onmousemove = (e: MouseEvent) => {
			const x = e.clientX - window.innerWidth / 2;
			const y = e.clientY - window.innerHeight / 2;

			this._Camera.OffsetPosition(y * -0.001, 0, x * 0.001, false);
			console.log(1, this._Camera.PerspectiveCamera.rotation);
		}
	}

	public Update()
	{
		// Update cam rotation to focus the center of the scene
		// this._Camera.PerspectiveCamera.lookAt(0, 1.5, 0);
	}
}

export default Control;