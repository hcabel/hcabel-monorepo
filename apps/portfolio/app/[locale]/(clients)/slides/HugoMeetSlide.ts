import * as THREE from 'three';

import Experience from "3D/Experience";
import Camera from '3D/world/Camera';
import Slide3dBehavior from './Slide3dBehavior';

class HugoMeetSlide extends Slide3dBehavior
{

	private _StartRotationY: number;
	private _EndRotationY: number;

	protected Resize()
	{
		this._BoundingBox.setFromCenterAndSize(
			this._ScenePosition.clone(),
			new THREE.Vector3(10, 15, (this._Condensed ? 20 : 22.5))
		);
	}

	constructor(condensed = false)
	{
		super(
			condensed,
			"HugoMeet",
			new THREE.Vector3(0, -33, 0),
			new THREE.Vector3(10, 15, (condensed ? 20 : 22.5)),
			new THREE.Vector3(-1, 0.25, 0)
		);

		// Scroll movements
		this._StartRotationY = Math.PI / 180 * 60;
		this._EndRotationY = Math.PI / 180 * -120;
	}

	public onEnter(direction: number)
	{
		if (this._Experience.IsReady) {
			// Get either the start or the end of the path depending on the direction where the scroll is from
			const camPosition = this.GetCameraPositionToFocusBox(this._BoundingBox, new THREE.Vector3(-1, 0.25, 0));
			this._Camera.AnimatesToWhileFocusing(camPosition, this._ScenePosition, 0.025);
		}
	}

	public onScroll(progress: number)
	{
		if (this._Experience.IsReady) {
			// Rotate the scene from 45 deg to 405 deg
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

export default HugoMeetSlide;