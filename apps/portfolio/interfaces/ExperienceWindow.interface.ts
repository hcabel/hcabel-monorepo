import Experience from "3D/Experience";

type IOldWindow = Window & typeof globalThis;

export interface IWindowExperienceExtra {
	experience: Experience;
}

type IWindowExperience = IOldWindow & IWindowExperienceExtra;

export default IWindowExperience;