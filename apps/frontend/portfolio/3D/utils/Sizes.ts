import { EventEmitter } from "events";

class Sizes extends EventEmitter {
	private _Width: number;
	private _Height: number;
	private _Aspect: number;
	private _PixelRatio: number;
	private _Canvas: HTMLElement | undefined;

	get Width(): number {
		return this._Width;
	}
	get Height(): number {
		return this._Height;
	}
	get Aspect(): number {
		return this._Aspect;
	}
	get PixelRatio(): number {
		return this._PixelRatio;
	}

	set Canvas(canvas: HTMLElement) {
		this._Canvas = canvas;
		this.OnResize();
	}

	constructor(canvas: HTMLElement = undefined) {
		super(); // call EventEmitter constructor

		this._Canvas = canvas;

		// Class OnResize method when window is resized
		window.addEventListener("resize", this.OnResize.bind(this));
		// And a first time to initialize the current size
		this.OnResize();
	}

	private OnResize() {
		if (this._Canvas) {
			this._Width = this._Canvas.clientWidth;
			this._Height = this._Canvas.clientHeight;
		} else {
			this._Width = window.innerWidth;
			this._Height = window.innerHeight;
		}

		this._Aspect = this._Width / this._Height;
		this._PixelRatio = Math.min(window.devicePixelRatio, 2);

		// Trigger listeners
		this.emit("resize");
	}
}

export default Sizes;
