/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "*.svg" {
	const content: any;
	export const ReactComponent: any;
	export default content;
}

declare module "*.glsl" {
	const value: string;
	export default value;
}
