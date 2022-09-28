
import EventEmitter from 'events';
import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

class GLTFAsset extends EventEmitter {

	static TraverseMeshs(scene: THREE.Group, callback: (mesh: THREE.Mesh) => void, depth = 0) {
		if (depth >= 10) {
			throw new Error("Too much depth in your scene");
		}

		for (const child of scene.children) {
			if (child instanceof THREE.Mesh) {
				callback(child);
			}
			else if (child instanceof THREE.Group) {
				GLTFAsset.TraverseMeshs(child, callback, depth + 1);
			}
		}
	}

	private static _GLTFLoader: GLTFLoader;
	private static _DRACOLoader: DRACOLoader;
	private _FilePath: string;
	private _Content: any | undefined;
	private _Meshs: Map<string, THREE.Mesh>;

	get Content(): any | undefined { return this._Content; }
	get Scene(): THREE.Group | undefined { return this._Content?.scene; }
	get Meshs(): Map<string, THREE.Mesh> | undefined { return this._Meshs; }

	constructor(filePath: string)
	{
		super(); // call EventEmitter constructor

		this._FilePath = filePath;

		this._Meshs = new Map<string, THREE.Mesh>();

		// Setup loader
		if (GLTFAsset._GLTFLoader === undefined || GLTFAsset._DRACOLoader === undefined) {
			console.log("Setup GLTF loader");
			GLTFAsset._GLTFLoader = new GLTFLoader();
			GLTFAsset._DRACOLoader = new DRACOLoader();
			GLTFAsset._DRACOLoader.setDecoderPath("/draco/");
			GLTFAsset._GLTFLoader.setDRACOLoader(GLTFAsset._DRACOLoader);
		}
	}

	public StartLoading()
	{
		GLTFAsset._GLTFLoader.load(this._FilePath, (content: any) => {
			this._Content = content;

			// Store all mesh in the map for quick access
			GLTFAsset.TraverseMeshs(this._Content.scene, (mesh) => {
				this._Meshs.set(mesh.name, mesh);
			});

			this.emit("loaded", this);
		});
	}
}

export default GLTFAsset;