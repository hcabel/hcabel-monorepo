import * as THREE from 'three';

import Experience from "3D/Experience";
import Slide3dBehavior from './Slide3dBehavior';

class ProceduralTerrainSlide extends Slide3dBehavior
{
	protected Resize()
	{
		this._BoundingBox.setFromCenterAndSize(
			this._ScenePosition,
			new THREE.Vector3(12.5, (this._Condensed ? 20 : 25), 12.5)
		);
	}

	constructor(condensed = false)
	{
		super(
			condensed,
			"Procedural Terrain", // scene name
			new THREE.Vector3(0, -75, 0), // scene pos
			new THREE.Vector3(12.5, (condensed ? 20 : 25), 12.5), // scene size
			new THREE.Vector3(-1, 1, 0) // camera direction
		);
	}

	public onEnter(direction: number)
	{
		if (this._Experience.IsReady) {
			// Move the camera to look at the scene
			this._Camera.AnimatesToWhileFocusing(
				// Find camera position from the scene boundingbox and the camera direction
				this.GetCameraPositionToFocusBox(this._BoundingBox, this._CameraDirection),
				// where to look at
				this._ScenePosition,
				0.025
			);
		}
	}

	public onScroll(progress: number)
	{
		if (this._Experience.IsReady) {
			// Rotate the scene from 45 deg to -315 deg
			this._Scene.rotation.y = progress * -(Math.PI * 2 /* 360deg */) + (Math.PI / 4 /* 45deg */);
		}
	}

	public onLeave(direction: number)
	{
		if (this._Experience.IsReady) {
			// Cancel Anim in case your scrolling fast
			this._Camera.CancelAnimation();
			// unfocus from the scene center
			this._Camera.Unfocus();
		}
	}
}

export default ProceduralTerrainSlide;