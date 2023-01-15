import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import Resources from "./Resource";

/**
 * @class ResourcesLoader
 * @description A class that containt all the loader for every kind of resources.
 */
export default class ResourcesLoader
{
	private static _Instance: ResourcesLoader;

	// Own properties
	private _GLTFLoader: GLTFLoader;
	private _DRACOLoader: DRACOLoader;
	private _TextureLoader: THREE.TextureLoader;

	constructor()
	{
		if (ResourcesLoader._Instance) {
			return ResourcesLoader._Instance;
		}
		ResourcesLoader._Instance = this;

		this._GLTFLoader = new GLTFLoader();
		this._DRACOLoader = new DRACOLoader();
		this._DRACOLoader.setDecoderPath("/draco/");
		this._GLTFLoader.setDRACOLoader(this._DRACOLoader);

		this._TextureLoader = new THREE.TextureLoader();
	}

	public LoadSync(resource: Resources<any>): void
	{
		// Load scene from path (in public) and convert it to GLTF
		if (resource.Type === 'gltf') {
			this._GLTFLoader
				.load(resource.Raw, (scene: GLTF) => {
					resource.Value = scene;
					return;
				});
		}
		// Load image from path (in public) and convert it to texture
		else if (resource.Type === 'texture') {
			this._TextureLoader
				.load(resource.Raw, (texture: THREE.Texture) => {
					resource.Value = texture;
					return;
				});
		}
		// Load image from imported image and convert it to texture
		else if (resource.Type === 'StaticImageData') {
			resource.Value = resource.Raw;
		}
	}

	public LoadAsync(resource: Resources<any>): Promise<void>
	{
		return new Promise((resolve) => {
			// Load scene from path (in public) and convert it to GLTF
			if (resource.Type === 'gltf') {
				this._GLTFLoader
					.loadAsync(resource.Raw)
					.then((scene: GLTF) => {
						resource.Value = scene;
						resolve();
					});
			}
			// Load image from path (in public) and convert it to texture
			else if (resource.Type === 'texture') {
				this._TextureLoader
					.loadAsync(resource.Raw)
					.then((texture: THREE.Texture) => {
						resource.Value = texture;
						resolve();
					});
			}
			// Load image from imported image and convert it to texture
			else if (resource.Type === 'StaticImageData') {
				this._TextureLoader
					.loadAsync(resource.Raw.src)
					.then((texture: THREE.Texture) => {
						resource.Value = texture;
						resolve();
					});
			}
		});
	}

	public WaitForEvreryone(resources: Resources<any>[]): Promise<void>
	{
		return new Promise((resolve) => {
			let loaded = 0;
			resources.forEach((resource) => {
				this.LoadAsync(resource)
					.then(() => {
						loaded++;
						if (loaded === resources.length) {
							resolve();
						}
					});
			});
		});
	}
}