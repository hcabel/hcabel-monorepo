import { EventEmitter } from "events";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import Renderer from "@3D/Renderer";
import { AssetsObject } from "./Assets";

class Resources extends EventEmitter {

	private _Renderer: Renderer;
	private _Assets: AssetsObject[];
	private _Items: any;
	private _Loaders: GLTFLoader;

	private _Queue: number;
	private _Loaded: number;

	get Items(): any { return this._Items; }

	constructor(Assets: AssetsObject[])
	{
		super(); // call EventEmitter constructor

		this._Assets = Assets;
		this._Items = {}

		this._Queue = this._Assets.length;
		this._Loaded = 0;

		this.SetLoader();
		this.StartLoading();
	}

	private SetLoader()
	{
		this._Loaders = {
			gfltLoader: new GLTFLoader(),
			dracoLoader: new DRACOLoader()
		};
		this._Loaders.dracoLoader.setDecoderPath("/draco/");
		this._Loaders.gfltLoader.setDRACOLoader(this._Loaders.dracoLoader);
	}

	private StartLoading()
	{
		this._Assets.forEach((asset: AssetsObject) => {
			if (asset.type === "gblModel") {
				this._Loaders.gfltLoader.load(asset.path, (file) => {
					this.SingleAssetLoaded(asset.name, file);
				});
			}
		});
	}

	private SingleAssetLoaded(name: string, file: any)
	{
		this._Items[name] = file;
		this._Loaded++;
		if (this._Loaded === this._Queue) {
			this.emit("loaded");
		}
	}
}

export default Resources;