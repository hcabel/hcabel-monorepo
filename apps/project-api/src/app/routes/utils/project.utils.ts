import { IProject, IProjectModel } from "@hcabel/types/ProjectApi";

export function IProjectModelArrayToIProjects(project: IProjectModel): IProject
{
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { _id, __v, ...projectInfos } = project;
	return (projectInfos);
}