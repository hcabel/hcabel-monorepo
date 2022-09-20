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
		this._Environements = new Environements(this._Scene);
		this._Assets = [
			new GLTFAsset("models/scene.glb")
				.on("loaded", (asset: GLTFAsset) => {
					asset.Scene.scale.set(0.1, 0.1, 0.1);

					const generator = new THREE.PMREMGenerator(new Canvas3D().Renderer.WebGLRenderer);
					const cubemap = generator.fromScene(this._Scene, 0, 5, 20).texture;

					for (const [name, mesh] of asset.Meshs) {

						// If material name start with "glass", add reflection and transparency
						if (/glass/i.test(mesh.material.name)) {
							mesh.material.roughness = 0;
							mesh.material.reflectivity = 1;
							mesh.material.envMap = cubemap;
							mesh.material.opacity = 0.5;
						}

						// Enable shadow
						mesh.castShadow = true;
						mesh.receiveShadow = true;

						if (name == "GroundTerrainTop") {

							// Load terrain height map
							const heightmap = new THREE.TextureLoader().load("images/terrain.png");

							// Tile texture
							heightmap.wrapS = THREE.RepeatWrapping;
							heightmap.wrapT = THREE.MirroredRepeatWrapping; // This is because I messed up the tilling in the texture (on the Y axis)

							// Apply the height map to the terrain
							mesh.material = new THREE.MeshPhongMaterial({
								map: heightmap,
								displacementMap: heightmap,
								displacementScale: 0.5,
							});
						}
					}

					this._Scene.add(asset.Scene);
				}),
		];

		this.LoadAllAssets();
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

	public Update()
	{
		// Update GroundTerrainTop displacecment map offset
		const ground = this._Assets[0].Meshs.get("GroundTerrainTop");
		if (ground) {
			const offset = ground.material.displacementMap.offset;

			const speed = 0.0005;

			// Offset the texture
			ground.material.map.offset.x = (offset.x + speed) % 1;
			ground.material.map.offset.y = (offset.y + speed) % 2;
		}
	}
}

export default World;