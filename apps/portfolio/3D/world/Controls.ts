
import * as THREE from 'three';

import Camera from "./Camera";

class Control
{
	// Quick access
	private _Camera: Camera;

	constructor(InCamera: Camera)
	{
		this._Camera = InCamera;

		// Listen to mouse pointer to animate camera
		window.onmousemove = (event: MouseEvent) => {
			const rotationX = (event.clientX - window.innerWidth / 2) * 2 / window.innerWidth;
			const rotationY = (event.clientY - window.innerHeight / 2) * 2 / window.innerHeight;
			this._Camera.OffsetPosition(rotationX, rotationY, 0);
		};

		this._Camera.MoveTo(0, 2.5, 5, true);
	}

	public Update()
	{
		// Update cam rotation to focus the center of the scene
		this._Camera.PerspectiveCamera.lookAt(0, 1.5, 0);
	}
}

export default Control;