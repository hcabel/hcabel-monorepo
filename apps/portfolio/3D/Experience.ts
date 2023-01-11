import * as THREE from 'three';
import { EventEmitter } from 'events';
import Stats from 'stats.js';

import Sizes from '3D/utils/Sizes';
import Clock from '3D/utils/Clock';
import World from '3D/world/World';

import Resource from './utils/Resource';
import ResourcesLoader from './utils/ResourcesLoader';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

class Experience extends EventEmitter
{
	// Own properties
	private _Canvas: HTMLCanvasElement;
	private _Clock: Clock;
	private _Sizes: Sizes;
	private _Resources: Resource<any>[];
	private _World: World;

	private _Stats: Stats;

	// Own properties getters
	get Canvas(): HTMLCanvasElement { return this._Canvas; }
	get Clock(): Clock { return this._Clock; }
	get Sizes(): Sizes { return this._Sizes; }
	get Resources(): Resource<any>[] { return this._Resources; }
	get World(): World { return this._World; }

	private AssignTextureToScene(scene: GLTF, texture: THREE.Texture): void
	{
		const material = new THREE.MeshBasicMaterial({
			map: texture,
			transparent: true
		});
		scene.scene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.material = material;
			}
		});
	}

	constructor(canvas: HTMLCanvasElement, atlas: Resource<THREE.Texture, string>, scene: Resource<GLTF, string>)
	{
		super();

		if (!canvas || !atlas || !scene) {
			throw Error('Experience: missing parameters');
		}

		// Init experience properties
		this._Canvas = canvas;
		this._Clock = new Clock();
		this._Sizes = new Sizes(this._Canvas);
		this._World = new World(this);
		this._Resources = [
			atlas,
			scene
		];
		atlas.once('dispose', () => {
			atlas.Value.dispose();
		});
		scene.once('dispose', () => {
			scene.Value.scene.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					const materials = Array.isArray(child.material) ? child.material : [child.material];
					materials.forEach((material) => {
						material.dispose();
						material.map?.dispose();
					});
				}
			});
			this._World.Scene.remove(scene.Value.scene);
		});

		// I have lost the context of "this" in the callbacks, so I have to use a variable to keep it (I don't know why, it was working before)
		let that = this;
		atlas.once('load', (texture: THREE.Texture) => {
			texture.flipY = false;
			if (scene.Loaded) {
				that.AssignTextureToScene(scene.Value, texture);
			}
		});
		scene.once('load', (gltf: GLTF) => {
			if (atlas.Loaded) {
				that.AssignTextureToScene(gltf, atlas.Value);
			}
			that._World.Scene.add(gltf.scene);
		});

		this.on('update', this.Update);
		this.on('resize', this.Resize);

		// Load resources
		this.on('loaded', () => {
			this._Clock.on('tick', () => that.emit('update'));
			this._Sizes.on('resize', () => that.emit('resize'));
			this.emit('ready');
		});
		const resourcesLoader = new ResourcesLoader();
		resourcesLoader.WaitForEvreryone(this._Resources)
			.then(() => { that.emit('loaded'); });

		// // Performances stats (optional)
		// this._Stats = new Stats();
		// if (this._Stats) {
		// 	this._Stats.showPanel(0);
		// 	document.body.appendChild(this._Stats.dom);
		// }
	}

	public Dispose()
	{
		this.removeAllListeners();
		this._Canvas = undefined;
		this._Resources.forEach((resource) => {
			resource.emit('dispose');
		});
		this._World.Dispose();
		delete this._Clock;
		delete this._Sizes;
		delete this._World;
		delete this._Resources;
	}

	private Update()
	{
		if (this._Stats) {
			this._Stats.begin();
		}

		if (this._World) {
			this._World.Update();
		}
		else {
			console.warn("No world");
		}

		if (this._Stats) {
			this._Stats.end();
		}
	}

	private Resize()
	{
		this._World.Resize();
	}

	public UpdateCanvas(canvas: HTMLCanvasElement)
	{
		// If the canvas is the same, return
		if (this.Canvas === canvas) {
			return;
		}
		this._Canvas = canvas;
		this._Sizes.Canvas = canvas;
		this._World.Renderer.Canvas = canvas;
	}
}

export default Experience;