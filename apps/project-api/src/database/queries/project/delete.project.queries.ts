import { IProjectSchema } from "@hcabel/types/ProjectApi";
import { Project } from "../../models";

/**
 * Delete a project
 * @param {IProjectSchema} filter the data needed to find the project to delete
 * @returns {boolean | null}
 * - true if the project was deleted
 * - false if the project was not deleted
 * - null if the query failed
 */
export function delete_one(filter: IProjectSchema): Promise<boolean | null>
{
	return (
		Project.table
			.deleteOne(filter)
			.then((result) => result.deletedCount === 1)
			.catch((error: any) => {
				console.error(error);
				return (null);
			})
	);
}