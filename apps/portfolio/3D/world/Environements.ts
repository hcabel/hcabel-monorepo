import * as THREE from 'three';

import Canvas3D from "@3D/Canvas3D";
import Resources from '@3D/utils/Resources';

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
		light.shadow.mapSize.set(2080 * 2, 2080 * 2);
		light.shadow.normalBias = 0.05;
		light.position.set(5, 10, 5);
		this._Scene.add(light);

		const ambiantLight = new THREE.AmbientLight("#ffffff", 1);
		this._Scene.add(ambiantLight);
	}
}

export default Environements;