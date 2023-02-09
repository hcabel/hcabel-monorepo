import EventEmitter from "events";

export type ResourceTypes = "gltf" | "texture" | "StaticImageData";

/**
 * @class Resource
 * @description A resource is a file that can be loaded and used by THREE js.
 */
export default class Resource<T, RawT = T> extends EventEmitter {
	// Own properties
	private _Value: T;
	private _Raw: RawT;
	private _Type: ResourceTypes;
	private _Loaded: boolean;

	// Own properties getters
	public get Raw(): RawT {
		return this._Raw;
	}
	public get Value(): T {
		return this._Value;
	}
	public get Type(): ResourceTypes {
		return this._Type;
	}
	public get Loaded(): boolean {
		return this._Loaded;
	}

	// Own properties setters
	public set Value(value: T) {
		this._Value = value;
		this._Loaded = true;
		this.emit("load", value);
	}

	constructor(raw: RawT, type: ResourceTypes) {
		super();

		this._Loaded = false;
		this._Raw = raw;
		this._Type = type;
	}
}
