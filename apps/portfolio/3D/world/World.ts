import * as THREE from 'three';

import Environements from '@3D/world/Environements';
import GLTFAsset from './GLTFAsset';

class World {

	// Own properties
	private _Scene: THREE.Scene;
	private _Assets: GLTFAsset[] = [];
	private _Environements: Environements;

	// Own properties getters
	get Scene(): THREE.Scene { return this._Scene; }

	constructor()
	{
		this._Scene = new THREE.Scene();
		this._Assets = [
			new GLTFAsset("models/scene.glb"),
		];

		this.LoadAllAssets()
			.then(() => {
				this._Environements = new Environements(this._Scene);

				// Create plane as a floor
				const plane = new THREE.Mesh(
					new THREE.PlaneGeometry(),
					new THREE.MeshStandardMaterial({
						color: 0x333333,
						roughness: 0.75,
						metalness: 0.5,
					})
				);
				plane.scale.set(10, 10, 1);
				plane.rotation.x = Math.PI * -0.5;
				plane.receiveShadow = true;
				this._Scene.add(plane);

				for (const asset of this._Assets) {
					asset.UpdateShadow(true, true);
					this._Scene.add(asset.Scene);
				}
			});
	}

	private async LoadAllAssets()
	{
		return new Promise<void>((resolve) => {
			const itemToLoad = this._Assets.length;
			let itemLoaded = 0;

			console.log("Assets loading...");
			this._Assets.forEach((asset: GLTFAsset) => {
				asset.StartLoading();
				asset.on('loaded', () => {
					itemLoaded++;
					if (itemLoaded === itemToLoad) {
						console.log("Assets loaded!");
						resolve();
					}
				});
			});
		});
	}
}

export default World;