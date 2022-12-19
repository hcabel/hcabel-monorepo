import { IVisitModel, IVisitSchema } from "@hcabel/types/TelemetryApi";
import { Visit } from "../../";

/**
 * Update a visit
 * @param {Partial<IVisitModel>} filter the data needed to find the visit to update
 * @param {Partial<IVisitSchema>} set A partial object with the data to update
 * @returns {Promise<IVisitModel> | null} The updated visit OR null if the query failed
 */
export function update_one(filter: Partial<IVisitModel>, set: Partial<IVisitSchema>): Promise<IVisitModel | null>
{
	return (
		Visit.table
			.findOneAndUpdate(
				filter,
				set,
				{ new: true }
			)
			.lean()
			.exec()
			.catch((error: any) => {
				console.error(error);
				return (null);
			})
	);
}
