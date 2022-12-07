import * as THREE from "three";
import { EventEmitter } from "events";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import assetsList, { IAssetsListKey } from "3D/assets";

export type LoadedAssetList = { [name in IAssetsListKey]?: any };

export default class Resources extends EventEmitter
{

	// Own properties
	private _GLTFLoader: GLTFLoader;
	private _DRACOLoader: DRACOLoader;
	private _Assets: LoadedAssetList;

	// Own properties getters
	public get Assets(): LoadedAssetList { return this._Assets; }

	constructor()
	{
		super();

		this._GLTFLoader = new GLTFLoader();
		this._DRACOLoader = new DRACOLoader();
		this._DRACOLoader.setDecoderPath("/draco/");
		this._GLTFLoader.setDRACOLoader(this._DRACOLoader);

		this.startLoading();
	}

	public startLoading()
	{
		this._Assets = {};
		for (const assetName in assetsList) {
			const asset = assetsList[assetName as IAssetsListKey];
			if (asset.type === 'gltf') {
				this._GLTFLoader.load(asset.path, (content: any) => {
					this.assetLoaded(assetName as IAssetsListKey, content.scene);
				});
			}
			else if (asset.type === 'texture') {
				new THREE.TextureLoader().load(asset.path, (texture: THREE.Texture) => {
					this.assetLoaded(assetName as IAssetsListKey, texture);
				});
			}
		}
	}

	private assetLoaded(assetName: IAssetsListKey, content: any)
	{
		this._Assets[assetName] = content;
		this.emit('assetLoaded', assetName);

		// Check if all assets are loaded
		if (Object.keys(this._Assets).length === Object.keys(assetsList).length) {
			this.emit('ready');
		}
	}
}