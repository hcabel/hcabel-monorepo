import * as THREE from 'three';

import Canvas3D from "@3D/Canvas3D";
import Resources from '@3D/utils/Resources';

import { Sky } from 'three/examples/jsm/objects/Sky.js';

class Environements {
	private _Canvas3D: Canvas3D;
	private _Scene: THREE.Scene;
	private _Resources: Resources;

	constructor()
	{
		this._Canvas3D = new Canvas3D();
		this._Scene = this._Canvas3D.Scene;
		this._Resources = this._Canvas3D.Resources;

		const light = new THREE.DirectionalLight("#ffffff", 3);
		light.castShadow = true;
		light.shadow.camera.far = 20;
		light.shadow.mapSize.set(4096, 4096);
		light.shadow.normalBias = 0.05;
		light.position.set(5, 10, 5);
		this._Scene.add(light);

		const ambiantLight = new THREE.AmbientLight("#ffffff", 1);
		this._Scene.add(ambiantLight);

		const sky = new Sky();
		sky.scale.setScalar( 450000 );

		const sun = new THREE.Vector3();

		const effectController = {
			turbidity: 10,
			rayleigh: 3,
			mieCoefficient: 0.005,
			mieDirectionalG: 0.8,
			elevation: 1,
			azimuth: 165,
		};

		const uniforms = sky.material.uniforms;
		uniforms[ 'turbidity' ].value = effectController.turbidity;
		uniforms[ 'rayleigh' ].value = effectController.rayleigh;
		uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
		uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

		this._Scene.add(sky);

		const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
		const theta = THREE.MathUtils.degToRad( effectController.azimuth );

		sun.setFromSphericalCoords( 1, phi, theta );

		uniforms[ 'sunPosition' ].value.copy( sun );

	}
}

export default Environements;