import * as THREE from "three";

import Camera from "3D/world/Camera";
import Sizes from "3D/utils/Sizes";
import Experience from "3D/Experience";

class Renderer {
	// Quick access
	private _Canvas: HTMLCanvasElement;
	private _Sizes: Sizes;
	private _Scene: THREE.Scene;
	private _Camera: Camera;

	// Own properties
	private _WebGLRenderer: THREE.WebGLRenderer;

	// Own properties getters
	get WebGLRenderer(): THREE.WebGLRenderer {
		return this._WebGLRenderer;
	}

	// Own properties setters
	set Canvas(InCanvas: HTMLCanvasElement) {
		this._Canvas = InCanvas;
		this.SetRenderer();
	}

	constructor(
		experience: Experience,
		InScene: THREE.Scene,
		InCamera: Camera
	) {
		this._Canvas = experience.Canvas;
		this._Sizes = experience.Sizes;
		this._Scene = InScene;
		this._Camera = InCamera;

		this.SetRenderer();
	}

	private SetRenderer() {
		// Create and configure renderer
		this._WebGLRenderer = new THREE.WebGLRenderer({
			canvas: this._Canvas,
			antialias: true,
			alpha: true,
		});
		this._WebGLRenderer.outputEncoding = THREE.sRGBEncoding;
		// this._WebGLRenderer.toneMapping = THREE.CineonToneMapping;
		// this._WebGLRenderer.toneMapping = THREE.ReinhardToneMapping;
		// this._WebGLRenderer.toneMapping = THREE.ACESFilmicToneMapping;
		this._WebGLRenderer.toneMappingExposure = 1;
		this.Resize();
	}

	public Resize() {
		this._WebGLRenderer.setSize(
			this._Sizes.Width,
			this._Sizes.Height,
			false
		);
		this._WebGLRenderer.setPixelRatio(this._Sizes.PixelRatio);
	}

	public Update() {
		this._WebGLRenderer.render(this._Scene, this._Camera.PerspectiveCamera);
	}
}

export default Renderer;
