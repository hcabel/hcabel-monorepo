import * as THREE from 'three';

import Resources from '3D/utils/Resource';
import Camera from '3D/world/Camera';
import Renderer from '3D/world/Renderer';
import Experience from '3D/Experience';

class World
{
	// Own properties
	private _Scene: THREE.Scene;
	private _Camera: Camera;
	private _Renderer: Renderer;
	private _MeshScenes: { [projectName: string]: THREE.Group };

	// Own properties getters
	get Scene(): THREE.Scene { return this._Scene; }
	get Camera(): Camera { return this._Camera; }
	get Renderer(): Renderer { return this._Renderer; }
	get MeshScenes(): { [projectName: string]: THREE.Group } { return this._MeshScenes; }

	constructor(experience: Experience)
	{
		this._Scene = new THREE.Scene();
		this._Camera = new Camera(experience, this._Scene);
		this._Renderer = new Renderer(experience, this._Scene, this._Camera);
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