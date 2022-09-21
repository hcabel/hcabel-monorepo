import * as THREE from 'three';

import Camera from "../Camera";

import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import GSAP from 'gsap';

class Controls
{
	// Quick access
	private _Camera: Camera;

	// Own properties
	private _StepIndex: number;
	private _StartPosition: THREE.Vector3;

	constructor(InCamera: Camera)
	{
		this._Camera = InCamera;

		// Set start camera position
		this._Camera.MoveTo(-2, 5, 8, true);
		this._Camera.RotateTo(new THREE.Quaternion(), true);

		// Register ScrollTrigger to navigate between UVCH and HugoMeet
		GSAP.registerPlugin(ScrollTrigger);
		ScrollTrigger.create({
			trigger: '#HtmlGridContent',
			markers: true,
			start: 'top top',
			end: 'bottom bottom',
			onUpdate: (e: ScrollTrigger) => {
				this._Camera.MoveTo(
					this._Camera.PerspectiveCamera.position.x,
					5 - (e.progress * 10),
					this._Camera.PerspectiveCamera.position.z
				);
			}
		});
	}
}

export default Controls;