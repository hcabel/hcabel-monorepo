import * as THREE from 'three';

import Environements from '@3D/world/Environements';
import GLTFAsset from './GLTFAsset';

import m_terrainV from '@3D/world/materials/TerrainVertex.glsl';
import m_terrainF from '@3D/world/materials/TerrainFragment.glsl';

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
					if (!asset.Meshs || !asset.Scene) {
						return;
					}

					asset.Scene.scale.set(0.1, 0.1, 0.1);
					asset.Scene.position.set(0, 5, 0);

					for (const [name, mesh] of asset.Meshs) {
						// if single material wrap it in an array
						const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

						for (const material of materials) {
							if (material instanceof THREE.MeshStandardMaterial) {
								material.roughness = 0;
								material.metalness = 0;
							}
						}

						// Enable shadow
						mesh.castShadow = true;
						mesh.receiveShadow = true;

						if (name === "GroundTerrain") {

							// Load terrain height map
							const heightmap = new THREE.TextureLoader().load("images/terrain.png");
							heightmap.wrapS = THREE.RepeatWrapping;
							heightmap.wrapT = THREE.MirroredRepeatWrapping; // This is because I messed up the tilling in the texture (on the Y axis)

							// https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders
							mesh.material = new THREE.ShaderMaterial({
								extensions: {
									derivatives: true,
								},

								defines: {
									STANDARD: '',
									PHYSICAL: '',
									USE_COLOR: '',
									FLAT_SHADED: '',
								},
								lights: true,
								vertexShader: THREE.ShaderChunk.meshphysical_vert
									.replace('void main() {', m_terrainV)
									.replace('#include <defaultnormal_vertex>', "vec3 transformedNormal = displacedNormal;")
									.replace('#include <displacementmap_vertex>', "transformed = displacedPosition;"),
								fragmentShader: THREE.ShaderChunk.meshphysical_frag
									.replace('void main() {', m_terrainF)
									.replace('#include <color_fragment>', "diffuseColor.rgb = fragment_color;"),
								uniforms: {
									...THREE.ShaderLib.physical.uniforms,
									tHeightMap: { value: heightmap },
									vOffset: { value: new THREE.Vector2(0, 0) },

									boundingBoxMin: { value: mesh.geometry.boundingBox.min },
									boundingBoxMax: { value: mesh.geometry.boundingBox.max },
								},
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
		const ground = this._Assets[0].Meshs?.get("GroundTerrain");
		if (ground) {
			const material = (Array.isArray(ground.material) ? ground.material[0] : ground.material) as THREE.ShaderMaterial;

			if (material) {
				const offset = material.uniforms.vOffset.value;
				const speed = 0.001;

				// Offset the texture
				offset.x = (offset.x + speed) % 1;
				offset.y = (offset.y + -speed) % 2;
			}
		}
	}
}

export default World;