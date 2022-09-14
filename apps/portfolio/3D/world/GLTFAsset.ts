
import EventEmitter from "events";
import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

class GLTFAsset extends EventEmitter {

	private static _GLTFLoader: GLTFLoader;
	private static _DRACOLoader: DRACOLoader;
	private _FilePath: string;
	private _Content: any | undefined;

	get Content(): any | undefined { return this._Content; }
	get Scene(): any | undefined { return this._Content?.scene; }

	constructor(filePath: string)
	{
		super(); // call EventEmitter constructor

		this._FilePath = filePath;

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
		GLTFAsset._GLTFLoader.load(this._FilePath, (content) => {
			this._Content = content;
			this.emit("loaded");
		});
	}

	public UpdateShadow(receiving: boolean, casting: boolean)
	{
		if (this._Content === undefined) {
			return;
		}

		this._Content.scene.traverse((child) => {
			if (child.isMesh) {
				child.castShadow = casting;
				child.receiveShadow = receiving;
			}
			else if (child instanceof THREE.Group) {
				child.children.forEach((childGroup) => {
					if (childGroup.isMesh) {
						childGroup.castShadow = casting;
						childGroup.receiveShadow = receiving;
					}
				});
			}
		});
	}
}

export default GLTFAsset;