import { Types } from "mongoose";
import { ProjectModel } from "../models";
import { IProjectDocument, IProjectModel, IProjectSchema } from "@hcabel/types/ProjectApi";

/**
 * Create new project in db
 * @param name name of the project
 * @param desc description of the project
 * @param stats id of the stats of the project (optional)
 * @returns the new project
 */
export function CreateNewProject(name: string, desc: string, descFr = ""): Promise<IProjectModel>
{
	return (
		ProjectModel.create<IProjectSchema>({
			name: name,
			description: {
				en: desc,
				fr: descFr
			}
		})
			.then((project) => {
				return (project?.toObject<IProjectModel>() || null);
			})
	);
}

/**
 * Get a project by its name
 * @param name name of the project
 * @returns the project with the given name
 */
export function GetProjectByName(name: string): Promise<IProjectModel | null>
{
	return (
		ProjectModel.findOne<IProjectDocument>({ name: name }).exec()
			.then((project) => {
				return (project?.toObject<IProjectModel>() || null);
			})
	);
}

/**
 * Get a project by its id
 * @param id id of the project
 * @returns the project with the given id
 */
export function GetProjectById(id: Types.ObjectId): Promise<IProjectModel | null>
{
	return (
		ProjectModel.findById<IProjectDocument>(id).exec()
			.then((project) => {
				return (project?.toObject<IProjectModel>() || null);
			})
	);
}

/**
 * Get all the projects
 * @param projectName name of the project
 * @returns true if project has been deleted, false otherwise
 */
export function RemoveProject(projectName: string): Promise<boolean>
{
	return (
		ProjectModel.deleteOne({ name: projectName }).exec()
			.then((res) => {
				return (res.deletedCount === 1);
			})
	);
}

/**
 * Check if a project exists
 * @param projectId id of the project
 * @returns true if project has been deleted, false otherwise
 */
export function RemoveProjectById(projectId: Types.ObjectId): Promise<boolean>
{
	return (
		ProjectModel.deleteOne({ _id: projectId }).exec()
			.then((res) => {
				return (res.deletedCount === 1);
			})
	);
}

/**
 * Update the name of a project
 * @param projectName name of the project
 * @param newName new name of the project
 * @returns the project updated
 */
export function UpdateProjectName(projectName: string, newName: string): Promise<IProjectModel | null>
{
	return (
		ProjectModel.findOneAndUpdate<IProjectDocument>({ name: projectName }, { name: newName }, { new: true }).exec()
			.then((project) => {
				return (project?.toObject<IProjectModel>() || null);
			})
	);
}

/**
 * Update the name of a project
 * @param projectId id of the project
 * @param newName new name of the project
 * @returns the project updated
 */
export function UpdateProjectNameById(projectId: Types.ObjectId, newName: string)
{
	return (
		ProjectModel.findByIdAndUpdate<IProjectDocument>(projectId, { name: newName }, { new: true }).exec()
			.then((project) => {
				return (project?.toObject<IProjectModel>() || null);
			})
	);
}

/**
 * Update the description of a project
 * @param projectId id of the project
 * @param newDesc new description of the project
 * @returns the project updated
 */
export function UpdateProjectDescription(projectName: string, newDesc: string): Promise<IProjectModel | null>
{
	return (
		ProjectModel.findOneAndUpdate<IProjectDocument>(
			{ name: projectName },
			{ description: newDesc },
			{ new: true }
		).exec()
			.then((project) => {
				return (project?.toObject<IProjectModel>() || null);
			})
	);
}

/**
 * Update the description of a project
 * @param projectId id of the project
 * @param newDesc new description of the project
 * @returns the project updated
 */
export function UpdateProjectDescriptionById(projectId: Types.ObjectId, newDesc: string): Promise<IProjectModel | null>
{
	return (
		ProjectModel.findByIdAndUpdate<IProjectDocument>(projectId, { description: newDesc }, { new: true }).exec()
			.then((project) => {
				return (project?.toObject<IProjectModel>() || null);
			})
	);
}