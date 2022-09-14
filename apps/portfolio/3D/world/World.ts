import * as THREE from 'three';

import Resources from '@3D/utils/Resources';
import Sizes from '@3D/utils/Sizes';

import Canvas3D from "@3D/Canvas3D";
import Camera from '@3D/world/Camera';

import Environements from '@3D/world/Environements';
import { DesktopSceneAsset } from '@3D/utils/Assets';

class World {
	private _Canvas3D: Canvas3D;

	private _Environements: Environements;
	private _Resources: Resources;
	private _Camera: Camera;
	private _Scene: THREE.Scene;

	// Quick access
	private _Sizes: Sizes;

	get Scene(): THREE.Scene { return this._Scene; }

	constructor()
	{
		this._Canvas3D = new Canvas3D();
		this._Sizes = this._Canvas3D.Sizes;

		this._Scene = new THREE.Scene();
		this._Camera = this._Canvas3D.Camera;
		this._Resources = new Resources([ DesktopSceneAsset ]);

		this._Resources.on('loaded', () => {
			this._Environements = new Environements();

			// Create plane as a floor
			const plane = new THREE.Mesh(
				new THREE.PlaneGeometry(100, 100),
				new THREE.MeshStandardMaterial({
					color: 0x888888,
					roughness: 0.75,
					metalness: 0.5,
				})
			);
			plane.scale.set(10, 10, 10);
			plane.rotation.x = -Math.PI * 0.5;
			plane.receiveShadow = true;
			this._Scene.add(plane);

			const actualScene = this._Resources.Items['DesktopScene'].scene;
			actualScene.children.forEach((child) => {
				if (child.name === 'FirstName' || child.name === 'LastName') {
					return;
				}
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

			// const gridHelper = new THREE.GridHelper();
			// this._Scene.add( gridHelper );
		});
	}
}

export default World;