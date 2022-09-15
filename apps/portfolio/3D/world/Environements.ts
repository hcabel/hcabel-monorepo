import * as THREE from 'three';

import { Sky } from 'three/examples/jsm/objects/Sky.js';

class Environements {
	private _Scene: THREE.Scene;

	constructor(InScene: THREE.Scene)
	{
		this._Scene = InScene;

		// @TODO: Is it weird that you see the sun but the directional light is at another angle?
		// Add directional light (sun)
		const light = new THREE.DirectionalLight("#ffffff", 8);
		light.castShadow = true;
		light.shadow.camera.far = 10;
		light.shadow.mapSize.set(2048, 2048);
		light.shadow.normalBias = 0.1;
		light.position.set(3, 5, 3);
		this._Scene.add(light);

		// Add ambient light (for the shadows)
		const ambiantLight = new THREE.AmbientLight("#ffffff", 1);
		this._Scene.add(ambiantLight);

		// show shadow debug
		// const helper = new THREE.CameraHelper(light.shadow.camera);
		// this._Scene.add(helper);

		// Create sky backgound
		const sky = new Sky();
		sky.scale.setScalar(20);

		// sky material
		const uniforms = sky.material.uniforms;
		uniforms['turbidity'].value = 10;
		uniforms['rayleigh'].value = 3;
		uniforms['mieCoefficient'].value = 0.005;
		uniforms['mieDirectionalG'].value = 1;

		// Set sun position
		const sun = new THREE.Vector3();
		const phi = THREE.MathUtils.degToRad(88);
		const theta = THREE.MathUtils.degToRad(0);
		sun.setFromSphericalCoords(1, phi, theta);
		uniforms['sunPosition'].value.copy(sun);

		this._Scene.add(sky);
	}
}

export default Environements;