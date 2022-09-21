import * as THREE from 'three';

import Canvas3D from "@3D/Canvas3D";
import Camera from '@3D/world/Camera';
import Sizes from '@3D/utils/Sizes';

class Renderer {
	private _Canvas3D: Canvas3D;
	private _Canvas: HTMLCanvasElement;
	private _Sizes: Sizes;
	private _Scene: THREE.Scene;
	private _Camera: Camera;
	private _WebGLRenderer: THREE.WebGLRenderer;

	get WebGLRenderer(): THREE.WebGLRenderer { return this._WebGLRenderer; }

	constructor()
	{
		this._Canvas3D = new Canvas3D();
		this._Canvas = this._Canvas3D.Canvas;
		this._Sizes = this._Canvas3D.Sizes;
		this._Scene = this._Canvas3D.World.Scene;
		this._Camera = this._Canvas3D.Camera;

		this.SetRenderer();
	}

	private SetRenderer()
	{
		this._WebGLRenderer = new THREE.WebGLRenderer({
			canvas: this._Canvas,
			antialias: true,
		});

		this._WebGLRenderer.physicallyCorrectLights = true;
		this._WebGLRenderer.outputEncoding = THREE.sRGBEncoding;
		this._WebGLRenderer.toneMapping = THREE.CineonToneMapping;
		// this._WebGLRenderer.toneMapping = THREE.ReinhardToneMapping;
		// this._WebGLRenderer.toneMapping = THREE.ACESFilmicToneMapping;
		this._WebGLRenderer.toneMappingExposure = 1;
		this._WebGLRenderer.shadowMap.enabled = true;
		this._WebGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.Resize();
		// console.log(this._WebGLRenderer.info);
	}

	public Resize()
	{
		this._WebGLRenderer.setSize(this._Sizes.Width, this._Sizes.Height);
		this._WebGLRenderer.setPixelRatio(this._Sizes.PixelRatio);
	}

	public Update()
	{
		this._WebGLRenderer.render(this._Scene, this._Camera.PerspectiveCamera);
	}
}

export default Renderer;