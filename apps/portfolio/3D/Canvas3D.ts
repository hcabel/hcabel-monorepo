import * as THREE from 'three';

import Sizes from '@3D/utils/Sizes';
import Time from '@3D/utils/Time';
import Resources from '@3D/utils/Resources';
import { DesktopSceneAsset } from './utils/Assets';

import Camera from "@3D/Camera";
import Renderer from '@3D/Renderer';
import World from '@3D/world/World';

class Canvas3D {
	// Singleton instance
	private static instance: Canvas3D;

	private _Canvas: HTMLCanvasElement;
	private _Sizes: Sizes;
	private _Scene: THREE.Scene;
	private _Camera: Camera;
	private _Renderer: Renderer;
	private _Time: Time;
	private _World: World;
	private _Resources: Resources;

	get Canvas(): HTMLCanvasElement { return this._Canvas; }
	get Sizes(): Sizes { return this._Sizes; }
	get Scene(): Sizes { return this._Scene; }
	get Camera(): Camera { return this._Camera; }
	get Renderer(): Renderer { return this._Renderer; }
	get Time(): Time { return this._Time; }
	get World(): World { return this._World; }
	get Resources(): Resources { return this._Resources; }

	constructor(canvas: HTMLCanvasElement | undefined = undefined)
	{
		// init/check singleton
		if (Canvas3D.instance) {
			return (Canvas3D.instance);
		}
		Canvas3D.instance = this;

		if (!canvas) {
			throw new Error("Canvas3D need a canvas element at initialization");
		}
		this._Canvas = canvas;
		this._Time = new Time();
		this._Sizes = new Sizes();
		this._Scene = new THREE.Scene();
		this._Camera = new Camera();
		this._Renderer = new Renderer();
		this._Resources = new Resources([ DesktopSceneAsset ]);
		this._World = new World();

		this._Time.on('update', () => {
			this.Update();
		});

		this._Sizes.on('resize', () => {
			this.Resize();
		});
	}

	Update()
	{
		this._Camera.Update();
		this._Renderer.Update();
	}

	Resize()
	{
		this._Camera.Resize();
		this._Renderer.Resize();
	}
}

export default Canvas3D;