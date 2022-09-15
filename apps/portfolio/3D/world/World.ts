import * as THREE from 'three';

import Environements from '@3D/world/Environements';
import GLTFAsset from './GLTFAsset';
import Canvas3D from '@3D/Canvas3D';

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

				const glass = this._Assets[0].Meshs.get("CubeBuilding_2");

				// Add reflection to the glass material
				const gen = new THREE.PMREMGenerator(new Canvas3D().Renderer.WebGLRenderer);
				glass.material.envMap = gen.fromScene(this._Scene, 0, 5, 20).texture;
				glass.material.roughness = 0;
				glass.material.reflectivity = 1;

				for (const asset of this._Assets) {
					// Enable casting and receiving shadows for all meshes
					GLTFAsset.TraverseMeshs(asset.Scene, (mesh) => {
						mesh.castShadow = true;
						mesh.receiveShadow = true;
					});

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