import Sizes from '@3D/utils/Sizes';
import Clock from '@3D/utils/Clock';

import Camera from "@3D/world/Camera";
import Renderer from '@3D/Renderer';
import World from '@3D/world/World';

class Canvas3D {
	// Singleton instance
	private static instance: Canvas3D;

	private _Canvas: HTMLCanvasElement;
	private _Clock: Clock;
	private _Sizes: Sizes;
	private _World: World;
	private _Renderer: Renderer;

	private _Camera: Camera;

	get Canvas(): HTMLCanvasElement { return this._Canvas; }
	get Clock(): Clock { return this._Clock; }
	get Sizes(): Sizes { return this._Sizes; }
	get World(): World { return this._World; }
	get Renderer(): Renderer { return this._Renderer; }

	get Camera(): Camera { return this._Camera; }

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
		this._Clock = new Clock();
		this._Sizes = new Sizes();
		this._World = new World();
		this._Camera = new Camera();
		this._Renderer = new Renderer();

		this._Clock.on('tick', () => {
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