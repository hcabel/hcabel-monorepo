import * as THREE from 'three';

class Environements {
	private _Scene: THREE.Scene;

	constructor(InScene: THREE.Scene)
	{
		this._Scene = InScene;

		// @TODO: Is it weird that you see the sun but the directional light is at another angle?
		// Add directional light (sun)
		const directionalLight = new THREE.DirectionalLight("#ffffff", 5);
		directionalLight.castShadow = true;
		directionalLight.shadow.camera.far = 25;
		directionalLight.shadow.mapSize.set(4096, 4096);
		directionalLight.shadow.normalBias = 0.1;
		directionalLight.position.set(5, 2, 10);

		directionalLight.shadow.camera.left = -3;
		directionalLight.shadow.camera.right = 3;
		directionalLight.shadow.camera.top = 10;
		directionalLight.shadow.camera.bottom = -10;

		this._Scene.add(directionalLight);

		// show shadow debug
		// const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
		// this._Scene.add(helper);

		// Add ambient light (for the shadows)
		const ambiantLight = new THREE.AmbientLight("#ffffff", 1);
		this._Scene.add(ambiantLight);

		// Add background plane
		const planeGeometry = new THREE.PlaneGeometry(20, 20);
		const planeMaterial = new THREE.MeshStandardMaterial({
			color: "#ffffff",
		});
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.position.set(0, 0, -1);
		plane.receiveShadow = true;
		this._Scene.add(plane);
	}
}

export default Environements;