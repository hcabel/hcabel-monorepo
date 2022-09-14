import * as THREE from 'three';

import Canvas3D from "../Canvas3D";
import Sizes from '@3D/utils/Sizes';
import Control from './Controls';

class Camera {
	// Quick access
	private _Canvas3D: Canvas3D;
	private _Sizes: Sizes;
	private _Scene: THREE.Scene;

	// Own properties
	private _PerspectiveCamera: THREE.PerspectiveCamera;
	private _Controls: Control;

	// Own properties getters
	get PerspectiveCamera(): THREE.PerspectiveCamera { return this._PerspectiveCamera; }

	constructor()
	{
		this._Canvas3D = new Canvas3D();
		this._Sizes = this._Canvas3D.Sizes;
		this._Scene = this._Canvas3D.World.Scene;

		this.InitPerspectiveCamera();
	}

	private InitPerspectiveCamera()
	{
		// Init cam
		this._PerspectiveCamera = new THREE.PerspectiveCamera(
			35,
			this._Sizes.Aspect,
			0.1,
			1000);
		this._Scene.add(this._PerspectiveCamera);

		// Init controls
		this._Controls = new Control(this);
	}

	public Resize()
	{
		this._PerspectiveCamera.aspect = this._Sizes.Aspect;
		this._PerspectiveCamera.updateProjectionMatrix();
	}

	public Update()
	{
		this._Controls.Update();
	}
}

export default Camera;