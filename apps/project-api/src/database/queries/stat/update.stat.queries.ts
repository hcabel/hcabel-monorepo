import { IStatModel, IStatSchema } from "@hcabel/types/ProjectApi";
import { Stat } from "../../models";

/**
 * Update a stat
 * @param {Partial<IStatSchema>} filter the data needed to find the stat to update
 * @param {Partial<IStatSchema>} set A partial object with the data to update
 * @returns {Promise<IStatModel> | null} The updated stat OR null if the query failed
 */
export function update_one(filter: Partial<IStatSchema>, set: Partial<IStatSchema>): Promise<IStatModel | null>
{
	return (
		Stat.table
			.findOneAndUpdate(
				filter,
				set,
				{ new: true }
			)
			.lean()
			.exec()
			.catch((error) => {
				console.error(error);
				return (null);
			})
	);
}
