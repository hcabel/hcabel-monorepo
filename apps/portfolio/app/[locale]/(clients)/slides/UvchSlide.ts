import * as THREE from 'three';

import Experience from "3D/Experience";
import Camera from '3D/world/Camera';
import Slide3dBehavior from './Slide3dBehavior';

class UvchSlide extends Slide3dBehavior
{
	private _StartRotationY: number;
	private _EndRotationY: number;

	protected Resize()
	{
		this._BoundingBox.setFromCenterAndSize(
			this._ScenePosition.clone().add(new THREE.Vector3(0, -2, 0)),
			new THREE.Vector3(10, (this._Condensed ? 15 : 20), 10)
		);
	}

	public constructor(condensed = false)
	{
		super(
			condensed,
			"Unreal VsCode Helper", // Scene name
			new THREE.Vector3(0, 2, 0), // Scene position
			new THREE.Vector3(10, (condensed ? 15 : 20), 10), // Scene bounding box size
			new THREE.Vector3(-1, 0.25, 0) // Camera direction
		);

		// Camera movements
		this._StartRotationY = Math.PI / 180 * 70;
		this._EndRotationY = Math.PI / 180 * -70;
	}

	public onEnter(direction: number)
	{
		if (this._Experience.IsReady) {
			const camPosition = this.GetCameraPositionToFocusBox(this._BoundingBox, new THREE.Vector3(-1, 0.25, 0));
			this._Camera.AnimatesToWhileFocusing(camPosition, this._ScenePosition, 0.025);
		}
	}

	public onScroll(progress: number)
	{
		if (this._Experience.IsReady) {
			this._Scene.rotation.y = progress * this._EndRotationY + this._StartRotationY;
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

export default UvchSlide;