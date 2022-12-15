import { IVisitDocument, IVisitSchema } from "@hcabel/types/TelemetryApi";
import { Visit } from "../../";

/**
 * Create a new visit
 * @param {IVisitSchema} data the data needed to create a new visit
 * @returns {Promise<IVisitDocument> | null} The new visit document created OR null if the query failed
 */
export function create(data: IVisitSchema): Promise<IVisitDocument | null>
{
	return (
		Visit.table
			.create(data)
			.catch((error: any) => {
				console.error(error);
				return (null);
			})
	);
}