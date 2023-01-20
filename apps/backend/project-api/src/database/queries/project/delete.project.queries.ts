import { IProjectModel } from "@hcabel/types/ProjectApi";
import { Project } from "../../models";

/**
 * Delete a project
 * @param {Partial<IProjectModel>} filter the data needed to find the project to delete
 * @returns {boolean | null}
 * - true if the project was deleted
 * - false if the project was not deleted
 * - null if the query failed
 */
export function delete_one(
	filter: Partial<IProjectModel>
): Promise<boolean | null> {
	return Project.table
		.deleteOne(filter)
		.then((result) => result.deletedCount === 1)
		.catch((error: any) => {
			console.error(error);
			return null;
		});
}
