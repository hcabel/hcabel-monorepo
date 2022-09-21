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
			trigger: '#HugoMeetProject',
			markers: false,
			start: 'top bottom',
			end: 'bottom bottom',
			onUpdate: (e: ScrollTrigger) => {
				this._Camera.MoveTo(
					this._Camera.PerspectiveCamera.position.x,
					5 - (e.progress * 5),
					this._Camera.PerspectiveCamera.position.z
				);
			}
		});
		// Register ScrollTrigger to navigate between HugoMeet and ProceduralTerrain
		ScrollTrigger.create({
			trigger: '#ProceTerrainProject',
			markers: false,
			start: 'top bottom',
			end: 'bottom bottom',
			onUpdate: (e: ScrollTrigger) => {
				const newpos = new THREE.Vector3(
					this._Camera.PerspectiveCamera.position.x,
					0 - (e.progress * 5),
					this._Camera.PerspectiveCamera.position.z
				);
				this._Camera.MoveTo(newpos.x, newpos.y, newpos.z);
				this._StartPosition = newpos;
			}
		});
	}
}

export default Controls;