import { IStatModel } from "@hcabel/types/ProjectApi";
import { Stat } from "../../models";

/**
 * Delete a stat
 * @param {IStatModel} filter the data needed to find the stat to delete
 * @returns {boolean | null}
 * - true if the stat was deleted
 * - false if the stat was not deleted
 * - null if the query failed
 */
export function delete_one(filter: IStatModel): Promise<boolean | null> {
	return Stat.table
		.deleteOne(filter)
		.then((result) => result.deletedCount === 1)
		.catch((error) => {
			console.error(error);
			return null;
		});
}
