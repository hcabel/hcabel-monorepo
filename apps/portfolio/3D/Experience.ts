import Sizes from '3D/utils/Sizes';
import Clock from '3D/utils/Clock';

import World from '3D/world/World';

import Stats from 'stats.js';
import Resources from './utils/Resources';
import { EventEmitter } from 'events';

class Experience extends EventEmitter
{
	// Singleton instance
	private static instance: Experience;

	// Own properties
	private _Canvas: HTMLCanvasElement;
	private _Clock: Clock;
	private _Sizes: Sizes;
	private _Resources: Resources;
	private _World: World;

	private _Stats: Stats;

	// Own properties getters
	get Canvas(): HTMLCanvasElement { return this._Canvas; }
	get Clock(): Clock { return this._Clock; }
	get Sizes(): Sizes { return this._Sizes; }
	get Resources(): Resources { return this._Resources; }
	get World(): World { return this._World; }

	constructor(canvas: HTMLCanvasElement | undefined = undefined)
	{
		// If the instance already exists, return it
		if (Experience.instance) {
			// Init experience if a canvas has been passed
			if (canvas) {
				Experience.instance.Init(canvas);
			}
			return (Experience.instance);
		}

		super();
		this.setMaxListeners(20);

		Experience.instance = this;
		// Init experience if a canvas has been passed
		if (canvas) {
			Experience.instance.Init(canvas);
		}
	}

	public Init(canvas: HTMLCanvasElement)
	{
		// If already initialized
		if (this.Canvas !== undefined) {

			// If the canvas is the same, return
			if (this.Canvas === canvas) {
				return;
			}
			this._Canvas = canvas;
			this._Sizes.Canvas = canvas;
			this._World.Renderer.Canvas = canvas;
		}

		// Init experience properties
		this._Canvas = canvas;
		this._Clock = new Clock();
		this._Sizes = new Sizes(this._Canvas);
		this._Resources = new Resources();
		this._World = new World();

		this._Resources.on('ready', () => {
			this._Clock.on('tick', () => {
				this.Update();
			});
			this._Sizes.on('resize', () => {
				this.Resize();
			});

			this.emit('ready');
		});

		// Performances stats
		// this._Stats = new Stats();
		// this._Stats.showPanel(0);
		// document.body.appendChild(this._Stats.dom);

		this.emit('initialized');
	}

	private Update()
	{
		// this._Stats.begin();

		this._World.Update();

		// this._Stats.end();
	}

	private Resize()
	{
		this._World.Resize();
	}
}

export default Experience;