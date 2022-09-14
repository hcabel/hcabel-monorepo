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
	private _Renderer: THREE.WebGLRenderer;

	constructor()
	{
		this._Canvas3D = new Canvas3D();
		this._Canvas = this._Canvas3D.Canvas;
		this._Sizes = this._Canvas3D.Sizes;
		this._Scene = this._Canvas3D.Scene;
		this._Camera = this._Canvas3D.Camera;

		this.SetRenderer();
	}

	private SetRenderer()
	{
		this._Renderer = new THREE.WebGLRenderer({
			canvas: this._Canvas,
			antialias: true,
		});

		this._Renderer.physicallyCorrectLights = true;
		this._Renderer.outputEncoding = THREE.sRGBEncoding;
		this._Renderer.toneMapping = THREE.CineonToneMapping;
		this._Renderer.toneMappingExposure = 1.5;
		this._Renderer.shadowMap.enabled = true;
		this._Renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this._Renderer.setSize(this._Sizes.Width, this._Sizes.Height);
		this._Renderer.setPixelRatio(this._Sizes.PixelRatio);
	}

	public Resize()
	{
		this._Renderer.setSize(this._Sizes.Width, this._Sizes.Height);
		this._Renderer.setPixelRatio(this._Sizes.PixelRatio);
	}

	public Update()
	{
		this._Renderer.render(this._Scene, this._Camera.PerspectiveCamera);
	}
}

export default Renderer;