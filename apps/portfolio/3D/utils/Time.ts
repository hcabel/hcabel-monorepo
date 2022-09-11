import { EventEmitter } from "events";

class Time extends EventEmitter {
	private _Start: number;
	private _Current: number;
	private _Elapsed: number;
	private _Delta: number;

	get start(): number { return this._Start; }
	get current(): number { return this._Current; }
	get elapsed(): number { return this._Elapsed; }
	get delta(): number { return this._Delta; }

	constructor()
	{
		super(); // call EventEmitter constructor

		this._Start = Date.now();
		this._Current = this._Start;
		this._Elapsed = 0;
		this._Delta = 16;

		this.Update();
	}

	private Update()
	{
		const currentTime = Date.now();
		this._Delta = currentTime - this._Current;
		this._Current = currentTime;
		this._Elapsed = this._Current - this._Start;

		this.emit("update");
		window.requestAnimationFrame(() => {
			this.Update();
		});
	}
}

export default Time;