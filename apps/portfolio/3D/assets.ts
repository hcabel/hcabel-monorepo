export interface IAsset {
	path: string;
	type: 'gltf' | 'texture';
}

const assetsList = {
	scene: {
		path: 'SM_Scene.glb',
		type: 'gltf',
	},
	T_Intro: {
		path: 'T_Intro.webp',
		type: 'texture',
	},
	T_Uvch: {
		path: 'T_Uvch.webp',
		type: 'texture',
	},
	T_HugoMeet: {
		path: 'T_HugoMeet.webp',
		type: 'texture',
	},
	T_ProcGen: {
		path: 'T_ProcGen.webp',
		type: 'texture',
	}
};

export type IAssetsList = typeof assetsList;
export type IAssetsListKey = keyof IAssetsList;

export default assetsList;