import * as THREE from 'three';

import Resources from '@3D/utils/Resources';
import Sizes from '@3D/utils/Sizes';

import Canvas3D from "@3D/Canvas3D";
import Camera from '@3D/Camera';

import Environements from '@3D/world/Environements';

class World {
	private _Canvas3D: Canvas3D;
	private _Canvas: HTMLCanvasElement;
	private _Sizes: Sizes;
	private _Scene: THREE.Scene;
	private _Camera: Camera;
	private _Resources: Resources;
	private _Environements: Environements;

	constructor()
	{
		this._Canvas3D = new Canvas3D();
		this._Canvas = this._Canvas3D.Canvas;
		this._Sizes = this._Canvas3D.Sizes;
		this._Scene = this._Canvas3D.Scene;
		this._Camera = this._Canvas3D.Camera;
		this._Resources = this._Canvas3D.Resources;

		this._Resources.on('loaded', () => {
			this._Environements = new Environements();

			const actualScene = this._Resources.Items['DesktopScene'].scene;

			actualScene.children.forEach((child) => {
				child.castShadow = true;
				child.receiveShadow = true;

				if (child instanceof THREE.Group) {
					child.children.forEach((groupChild) => {
						groupChild.castShadow = true;
						groupChild.receiveShadow = true;
					});
				}
			});

			this._Scene.add(actualScene);
		});
	}

	// public Resize()
	// {

	// }

	// public Update()
	// {

	// }
}

export default World;