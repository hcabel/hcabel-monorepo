import { IProjectModel, IProjectSchema } from "@hcabel/types/ProjectApi";
import { Project } from "../../models";

/**
 * Read all the projects in the data that match the filter
 * @param {Partial<IProjectSchema>} filter the data needed to find all the projects to read
 * @returns {Promise<IProjectModel[]> | null} The projects found OR null if the query failed
 */
export function read(filter: Partial<IProjectSchema>): Promise<IProjectModel[] | null>
{
	return (
		Project.table
			.find(filter)
			.lean()
			.exec()
			.catch((error: any) => {
				console.error(error);
				return (null);
			})
	);
}

/**
 * Read a single project in the data that match the filter
 * @param filter {Partial<IProjectSchema>} the data needed to find the project to read
 * @returns {Promise<IProjectModel> | null} The project found OR null if the query failed
 */
export function read_single(filter: Partial<IProjectSchema>): Promise<IProjectModel | null>
{
	return (
		Project.table
			.findOne(filter)
			.lean()
			.exec()
			.catch((error: any) => {
				console.error(error);
				return (null);
			})
	);
}