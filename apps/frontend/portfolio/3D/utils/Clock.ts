import { EventEmitter } from "events";

class Clock extends EventEmitter {
	private _Start: number;
	private _Current: number;
	private _Elapsed: number;
	private _Delta: number;

	get start(): number {
		return this._Start;
	}
	get current(): number {
		return this._Current;
	}
	get elapsed(): number {
		return this._Elapsed;
	}
	get delta(): number {
		return this._Delta;
	}

	constructor() {
		super(); // call EventEmitter constructor

		this._Start = Date.now();
		this._Current = this._Start;
		this._Elapsed = 0;
		this._Delta = 0;

		this.Update();
	}

	private Update() {
		window.requestAnimationFrame(() => this.Update());

		const currentTime = Date.now();
		this._Delta = currentTime - this._Current;
		this._Current = currentTime;
		this._Elapsed = this._Current - this._Start;

		if (this._Elapsed > 1000 / 30) {
			this.emit("tick");
		}
	}
}

export default Clock;
