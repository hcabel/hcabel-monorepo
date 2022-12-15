import { IVisitModel } from "@hcabel/types/TelemetryApi";
import { Visit } from "../../";

/**
 * Read all the visits in the data that match the filter
 * @param {Partial<IVisitModel>} filter the data needed to find all the visits to read
 * @returns {Promise<IVisitModel[]> | null} The visits found OR null if the query failed
 */
export function read(filter: Partial<IVisitModel>): Promise<IVisitModel[] | null>
{
	return (
		Visit.table
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
 * Read a single visit in the data that match the filter
 * @param filter {Partial<IVisitModel>} the data needed to find the visit to read
 * @returns {Promise<IVisitModel> | null} The visit found OR null if the query failed
 */
export function read_single(filter: Partial<IVisitModel>): Promise<IVisitModel | null>
{
	return (
		Visit.table
			.findOne(filter)
			.lean()
			.exec()
			.catch((error: any) => {
				console.error(error);
				return (null);
			})
	);
}