import { IProjectModel, IProjectSchema } from "@hcabel/types/ProjectApi";
import { Project } from "../../models";

/**
 * Update a project
 * @param {Partial<IProjectModel>} filter the data needed to find the project to update
 * @param {Partial<IProjectSchema>} set A partial object with the data to update
 * @returns {Promise<IProjectModel> | null} The updated project OR null if the query failed
 */
export function update_one(
	filter: Partial<IProjectModel>,
	set: Partial<IProjectSchema>
): Promise<IProjectModel | null> {
	return Project.table
		.findOneAndUpdate(filter, set, { new: true })
		.lean()
		.exec()
		.catch((error: any) => {
			console.error(error);
			return null;
		});
}
