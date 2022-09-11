import { EventEmitter } from "events";

class Sizes extends EventEmitter {
	private _Width: number;
	private _Height: number;
	private _Aspect: number;
	private _PixelRatio: number;

	get Width(): number { return this._Width; }
	get Height(): number { return this._Height; }
	get Aspect(): number { return this._Aspect; }
	get PixelRatio(): number { return this._PixelRatio; }

	constructor()
	{
		super(); // call EventEmitter constructor

		window.addEventListener("resize", () => {
			this.OnResize();
		});
		this.OnResize();
	}

	private OnResize()
	{
		this._Width = window.innerWidth;
		this._Height = window.innerHeight;
		this._Aspect = this._Width / this._Height;
		this._PixelRatio = Math.min(window.devicePixelRatio, 2);

		this.emit("resize");
	}
}

export default Sizes;