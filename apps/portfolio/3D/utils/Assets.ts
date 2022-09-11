
export type AssetsType = "gblModel";

export interface AssetsObject {
	name: string,
	type: AssetsType,
	path: `/${string}.${string}`,
}

export const DesktopSceneAsset: AssetsObject = {
	name: "DesktopScene",
	type: "gblModel",
	path: '/models/DesktopScene.glb',
};

const AllAssets: AssetsObject[] = [
	DesktopSceneAsset
];

export default AllAssets;