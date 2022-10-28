import * as THREE from 'three';
import IWindowExperience from 'Interfaces/ExperienceWindow.interface';

declare const window: IWindowExperience;

class Environement
{
	// Quick access
	private _Scene: THREE.Scene;

	constructor()
	{
		this._Scene = window.experience.World.Scene;

		const directionalLight = new THREE.DirectionalLight("#ffffff", 5);
		directionalLight.castShadow = true;
		directionalLight.shadow.camera.far = 25;
		directionalLight.shadow.mapSize.set(4096, 4096);
		directionalLight.shadow.normalBias = 0.1;
		directionalLight.position.set(5, 5, 5);
		directionalLight.shadow.camera.left = -3;
		directionalLight.shadow.camera.right = 3;
		directionalLight.shadow.camera.top = 10;
		directionalLight.shadow.camera.bottom = -10;
		directionalLight.intensity = 1.0;
		this._Scene.add(directionalLight);

		// show shadow debug
		// const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
		// this._Scene.add(helper);

		// Add ambient light (for the shadows)
		const ambiantLight = new THREE.AmbientLight("#ffffff", 1);
		this._Scene.add(ambiantLight);

		this._Scene.background = new THREE.Color("#3C4C5F");
	}
}

export default Environement;