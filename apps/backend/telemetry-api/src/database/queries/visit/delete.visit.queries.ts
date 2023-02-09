import { IVisitModel } from "@hcabel/types/TelemetryApi";
import { Visit } from "../../";

/**
 * Delete a visit
 * @param {Partial<IVisitModel>} filter the data needed to find the visit to delete
 * @returns {boolean | null}
 * - true if the visit was deleted
 * - false if the visit was not deleted
 * - null if the query failed
 */
export function delete_one(
	filter: Partial<IVisitModel>
): Promise<boolean | null> {
	return Visit.table
		.deleteOne(filter)
		.then((result) => result.deletedCount === 1)
		.catch((error: any) => {
			console.error(error);
			return null;
		});
}
