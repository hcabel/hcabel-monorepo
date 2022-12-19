export interface IAsset {
	path: string;
	type: 'gltf' | 'texture';
}

const assetsList = {
	scene: {
		path: 'SM_scene.glb',
		type: 'gltf',
	},
	uvchBackedTexture: {
		path: 'T_Scene.png',
		type: 'texture',
	}
};

export type IAssetsList = typeof assetsList;
export type IAssetsListKey = keyof IAssetsList;

export default assetsList;