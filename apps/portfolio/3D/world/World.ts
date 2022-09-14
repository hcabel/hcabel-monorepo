import * as THREE from 'three';

import Resources from '@3D/utils/Resources';
import Sizes from '@3D/utils/Sizes';

import Canvas3D from "@3D/Canvas3D";
import Camera from '@3D/Camera';

import Environements from '@3D/world/Environements';

class World {
	private _Canvas3D: Canvas3D;
	private _Sizes: Sizes;
	private _Scene: THREE.Scene;
	private _Camera: Camera;
	private _Resources: Resources;
	private _Environements: Environements | undefined;

	constructor()
	{
		this._Canvas3D = new Canvas3D();
		this._Sizes = this._Canvas3D.Sizes;
		this._Scene = this._Canvas3D.Scene;
		this._Camera = this._Canvas3D.Camera;
		this._Resources = this._Canvas3D.Resources;
		this._Environements = undefined;

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