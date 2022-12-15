import { Request } from "express";

import { IDatabase, IRequestResponse, Nested } from "@hcabel/rest-api-utils";
import { IRouteGetAllVisit, IVisitModel, ITelemetryApiQueries } from "@hcabel/types/TelemetryApi";
import { ConvertQueryToVisitFilter, IVisitModelToIVisit } from "./utils/formating.utils";

export async function GetAllVisit(req: Request): Promise<IRequestResponse<IRouteGetAllVisit>>
{
	const database = req.app.get('database') as IDatabase<ITelemetryApiQueries>;

	const filter: Partial<IVisitModel> = ConvertQueryToVisitFilter(req.query);

	const visits = await database.queries.Visit.read(filter);
	if (!visits) {
		return ({
			status: 500,
			json: {
				error: 'Failed to get visits'
			}
		});
	}

	const formatedReturn = visits.map((visitModel) => IVisitModelToIVisit(visitModel));
	console.log(formatedReturn)

	return ({
		status: 200,
		json: formatedReturn
	});
}