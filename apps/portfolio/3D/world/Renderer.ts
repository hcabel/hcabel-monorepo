import * as THREE from 'three';
import IWindowExperience from 'Interfaces/ExperienceWindow.interface';

import Camera from '3D/world/Camera';
import Sizes from '3D/utils/Sizes';

declare const window: IWindowExperience;

class Renderer
{
	// Quick access
	private _Canvas: HTMLCanvasElement;
	private _Sizes: Sizes;
	private _Scene: THREE.Scene;
	private _Camera: Camera;

	// Own properties
	private _WebGLRenderer: THREE.WebGLRenderer;

	// Own properties getters
	get WebGLRenderer(): THREE.WebGLRenderer { return this._WebGLRenderer; }

	constructor()
	{
		this._Canvas = window.experience.Canvas;
		this._Sizes = window.experience.Sizes;
		this._Scene = window.experience.World.Scene;
		this._Camera = window.experience.World.Camera;

		this.SetRenderer();
	}

	private SetRenderer()
	{
		// Create and configure renderer
		this._WebGLRenderer = new THREE.WebGLRenderer({
			canvas: this._Canvas,
			antialias: true,
		});
		this._WebGLRenderer.physicallyCorrectLights = true;
		this._WebGLRenderer.outputEncoding = THREE.sRGBEncoding;
		// this._WebGLRenderer.toneMapping = THREE.CineonToneMapping;
		// this._WebGLRenderer.toneMapping = THREE.ReinhardToneMapping;
		// this._WebGLRenderer.toneMapping = THREE.ACESFilmicToneMapping;
		this._WebGLRenderer.toneMappingExposure = 1;
		this._WebGLRenderer.shadowMap.enabled = true;
		this._WebGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.Resize();
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