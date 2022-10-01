import { Types } from "mongoose";
import Project, { IMProject } from "../models/project";

/**
 * Create new project in db
 * @param name name of the project
 * @param desc description of the project
 * @param stats id of the stats of the project (optional)
 * @returns the new project
 */
export function CreateNewProject(name: string, desc: string): Promise<IMProject>
{
	return (
		Project.create({
			name: name,
			description: desc
		})
	);
}

/**
 * Get a project by its name
 * @param name name of the project
 * @returns the project with the given name
 */
export function GetProjectByName(name: string): Promise<IMProject | null>
{
	return (
		Project.findOne({ name: name }).exec()
	);
}

/**
 * Get a project by its id
 * @param id id of the project
 * @returns the project with the given id
 */
export function GetProjectById(id: Types.ObjectId): Promise<IMProject | null>
{
	return (
		Project.findById(id).exec()
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
		Project.deleteOne({ name: projectName }).exec()
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
		Project.deleteOne({ _id: projectId }).exec()
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
export function UpdateProjectName(projectName: string, newName: string): Promise<IMProject | null>
{
	return (
		Project.findOneAndUpdate({ name: projectName }, { name: newName }, { new: true }).exec()
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
	return (Project.findByIdAndUpdate(projectId, { name: newName }));
}

/**
 * Update the description of a project
 * @param projectId id of the project
 * @param newDesc new description of the project
 * @returns the project updated
 */
export function UpdateProjectDescription(projectName: string, newDesc: string): Promise<IMProject | null>
{
	return (
		Project.findOneAndUpdate({ name: projectName }, { description: newDesc }, { new: true }).exec()
	);
}

/**
 * Update the description of a project
 * @param projectId id of the project
 * @param newDesc new description of the project
 * @returns the project updated
 */
export function UpdateProjectDescriptionById(projectId: Types.ObjectId, newDesc: string): Promise<IMProject | null>
{
	return (
		Project.findByIdAndUpdate(projectId, { description: newDesc }, { new: true }).exec()
	);
}