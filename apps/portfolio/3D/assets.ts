export interface IAsset {
	path: string;
	type: 'gltf' | 'texture';
}

const assetsList = {
	scene: {
		path: 'models/scene.glb',
		type: 'gltf',
	},
	uvchBackedTexture: {
		path: 'images/UVCH_BakedTexture_B.png',
		type: 'texture',
	}
};

export type IAssetsList = typeof assetsList;
export type IAssetsListKey = keyof IAssetsList;

export default assetsList;