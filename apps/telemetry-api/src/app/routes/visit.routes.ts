import { Request } from "express";

import { IRequestResponse } from "@hcabel/rest-api-utils";
import { IRouteGetAllVisit } from "@hcabel/types/TelemetryApi";

export async function GetAllVisit(req: Request): Promise<IRequestResponse<IRouteGetAllVisit>>
{
	return ({
		status: 200,
		json: []
	})
}