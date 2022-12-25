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
	private _MeshScenes: { [projectName: string]: THREE.Group };

	// Own properties getters
	get Scene(): THREE.Scene { return this._Scene; }
	get Camera(): Camera { return this._Camera; }
	get Renderer(): Renderer { return this._Renderer; }
	get MeshScenes(): { [projectName: string]: THREE.Group } { return this._MeshScenes; }

	constructor()
	{
		this._Resources = new Experience().Resources;
		this._Scene = new THREE.Scene();
		this._Camera = new Camera(this._Scene);
		this._Renderer = new Renderer(this._Scene, this._Camera);

		// Wait resources to be loaded before initializing the world
		this._Resources.on('ready', () => {

			// Create material with textures
			(this._Resources.Assets.T_Intro as THREE.Texture).flipY = false;
			(this._Resources.Assets.T_Uvch as THREE.Texture).flipY = false;
			(this._Resources.Assets.T_HugoMeet as THREE.Texture).flipY = false;
			(this._Resources.Assets.T_ProcGen as THREE.Texture).flipY = false;
			const bakedMaterials = [
				new THREE.MeshBasicMaterial({
					map: this._Resources.Assets.T_Intro,
					transparent: true
				}),
				new THREE.MeshBasicMaterial({
					map: this._Resources.Assets.T_Uvch,
					transparent: true
				}),
				new THREE.MeshBasicMaterial({
					map: this._Resources.Assets.T_HugoMeet,
					transparent: true
				}),
				new THREE.MeshBasicMaterial({
					map: this._Resources.Assets.T_ProcGen,
					transparent: true
				}),
			]

			const scene = this._Resources.Assets.scene as THREE.Group;

			this._MeshScenes = {
				"Intro": new THREE.Group(),
				"Unreal VsCode Helper": new THREE.Group(),
				"HugoMeet": new THREE.Group(),
				"Procedural Terrain": new THREE.Group(),
			};

			// create a group for all the meshs of the INTRO scene
			this._MeshScenes["Intro"].add(
				scene.getObjectByName('GithubLogo'),
				scene.getObjectByName('YtLogo'),
				scene.getObjectByName('BigScreen')
			);
			// Apply material to the Intro scene
			this._MeshScenes["Intro"].traverse((child: THREE.Mesh) => child.material = bakedMaterials[0]);

			// create a group for all the meshs of the UVCH scene
			this._MeshScenes["Unreal VsCode Helper"].add(
				scene.getObjectByName('FloorCube'),
				scene.getObjectByName('Logo'),
				scene.getObjectByName('neon'),
				scene.getObjectByName('neon001'),
				scene.getObjectByName('RoofLamp'),
				scene.getObjectByName('Window'),
				scene.getObjectByName('Chair'),
				scene.getObjectByName('Desk'),
				scene.getObjectByName('Keyboard'),
				scene.getObjectByName('MousePad'),
				scene.getObjectByName('Screen'),
				scene.getObjectByName('Books'),
				scene.getObjectByName('H_shelves'),
				scene.getObjectByName('Lamp'),
				scene.getObjectByName('Rubix'),
				scene.getObjectByName('V_shelves'),
			);
			// Apply material to the UVCH scene
			this._MeshScenes["Unreal VsCode Helper"].traverse((child: THREE.Mesh) => child.material = bakedMaterials[1]);

			// create a group for all the meshs of the HUGOMEET scene
			this._MeshScenes["HugoMeet"].add(
				scene.getObjectByName('HugoMeetLogo'),
				scene.getObjectByName('Beach'),
				scene.getObjectByName('Chara_Blue'),
				scene.getObjectByName('Chara_Red'),
				scene.getObjectByName('Montain'),
				scene.getObjectByName('Palm-tree'),
				scene.getObjectByName('Water'),
			);
			// Apply material to the HUGOMEET scene
			this._MeshScenes["HugoMeet"].traverse((child: THREE.Mesh) => child.material = bakedMaterials[2]);

			// create a group for all the meshs of the Procedural Terrain scene
			this._MeshScenes["Procedural Terrain"].add(
				scene.getObjectByName('MarchingCubeTerrain'),
				scene.getObjectByName('TerrainWater'),
			);
			// Apply material to the Procedural Terrain scene
			this._MeshScenes["Procedural Terrain"].traverse((child: THREE.Mesh) => child.material = bakedMaterials[3]);

			// add all the scenes to the world
			this._Scene.add(
				this._MeshScenes["Intro"],
				this._MeshScenes["Unreal VsCode Helper"],
				this._MeshScenes["HugoMeet"],
				this._MeshScenes["Procedural Terrain"],
			);
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