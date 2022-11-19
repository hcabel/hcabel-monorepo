import * as THREE from 'three';

import Resources from '3D/utils/Resources';
import Camera from '3D/world/Camera';
import Renderer from '3D/world/Renderer';
import Experience from '3D/Experience';

class World
{
	// Quick access
	private _Resources: Resources;

	// Own properties
	private _Scene: THREE.Scene;
	private _Camera: Camera;
	private _Renderer: Renderer;

	// Own properties getters
	get Scene(): THREE.Scene { return this._Scene; }
	get Camera(): Camera { return this._Camera; }
	get Renderer(): Renderer { return this._Renderer; }

	constructor()
	{
		this._Resources = new Experience().Resources;
		this._Scene = new THREE.Scene();
		this._Camera = new Camera(this._Scene);
		this._Renderer = new Renderer(this._Scene, this._Camera);

		// Wait resources to be loaded before initializing the world
		this._Resources.on('ready', () => {
			(this._Resources.Assets.uvchBackedTexture as THREE.Texture).flipY = false;
			const bakedMaterial = new THREE.MeshBasicMaterial({
				map: this._Resources.Assets.uvchBackedTexture,
				transparent: true
			});

			const scene = this._Resources.Assets.scene as THREE.Group;
			const sceneMeshs = new Map<string, THREE.Mesh>();

			for (const child of scene.children) {
				if (child instanceof THREE.Group) {
					child.children.forEach((groupChild) => {
						if (groupChild instanceof THREE.Mesh) {
							groupChild.material = bakedMaterial;
							sceneMeshs.set(groupChild.name, groupChild);
						}
					});
				}
				else if (child instanceof THREE.Mesh) {
					child.material = bakedMaterial;
					sceneMeshs.set(child.name, child);
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