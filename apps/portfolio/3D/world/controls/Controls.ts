import Camera from "../Camera";

class Control
{
	// Quick access
	private _Camera: Camera;

	constructor(InCamera: Camera)
	{
		this._Camera = InCamera;
	}

	public Update()
	{
		return;
	}
}

export default Control;