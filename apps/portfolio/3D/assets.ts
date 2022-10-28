export interface IAsset {
	path: string;
	type: 'gltf' | 'texture';
}

export type AssetsMap = { [name: string]: IAsset };

const assetsList: AssetsMap = {
	scene: {
		path: 'models/scene.glb',
		type: 'gltf',
	},
	bakedUvch: {
		path: 'images/UVCH_BakedTexture.png',
		type: 'texture',
	}
};

export default assetsList;