import * as THREE from 'three';
import IWindowExperience from 'Interfaces/ExperienceWindow.interface';

import Resources from '3D/utils/Resources';
import Environement from '3D/world/Environement';
import Camera from '3D/world/Camera';
import Renderer from '3D/world/Renderer';

declare const window: IWindowExperience;

class World
{
	// Quick access
	private _Resources: Resources;

	// Own properties
	private _Scene: THREE.Scene;
	private _Environement: Environement;
	private _Camera: Camera;
	private _Renderer: Renderer;

	// Own properties getters
	get Scene(): THREE.Scene { return this._Scene; }
	get Camera(): Camera { return this._Camera; }
	get Renderer(): Renderer { return this._Renderer; }

	constructor()
	{
		this._Resources = window.experience.Resources;

		// Wait resources to be loaded before initializing the world
		this._Resources.on('ready', () => {
			this._Scene = new THREE.Scene();
			this._Environement = new Environement();
			this._Camera = new Camera();
			this._Renderer = new Renderer();

			const scene = this._Resources.Assets.scene as THREE.Group;
			for (const child of scene.children) {
				if (child.isObject3D) {
					const object = child as THREE.Mesh;
					const texture = this._Resources.Assets.uvchBackedTexture as THREE.Texture;
					object.material = new THREE.MeshStandardMaterial({
						map: texture,
					});
				}
			}
			this._Scene.add(scene);
		});
	}

	public Update()
	{
		this._Camera.Update();
		this._Renderer.Update();
	}

	public Resize()
	{
		this._Camera.Resize();
		this._Renderer.Resize();
	}
}

export default World;