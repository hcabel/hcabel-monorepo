import { IProjectDocument, IProjectSchema } from "@hcabel/types/ProjectApi";
import { Project } from "../../models";

/**
 * Create a new project
 * @param {IProjectSchema} data the data needed to create a new project
 * @returns {Promise<IProjectDocument> | null} The new project document created OR null if the query failed
 */
export function create(data: IProjectSchema): Promise<IProjectDocument | null>
{
	return (
		Project.table
			.create(data)
			.catch((error: any) => {
				console.error(error);
				return (null);
			})
	);
}