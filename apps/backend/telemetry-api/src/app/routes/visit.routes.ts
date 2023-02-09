import { IDatabase, IRequestResponse } from "@hcabel/rest-api-utils";
import {
	IRouteGetAllVisit,
	IVisitModel,
	ITelemetryApiQueries,
	IRouteCreateVisit,
} from "@hcabel/types/TelemetryApi";
import { Request as ExpressRequest } from "express";
import {
	ConvertQueryToVisitFilter,
	IVisitModelToIVisit,
} from "./utils/formating.utils";

export async function GetAllVisit(
	req: ExpressRequest
): Promise<IRequestResponse<IRouteGetAllVisit>> {
	const database = req.app.get("database") as IDatabase<ITelemetryApiQueries>;

	const filter: Partial<IVisitModel> = ConvertQueryToVisitFilter(req.query);

	const visits = await database.queries.Visit.read(filter);
	if (!visits) {
		throw new Error("Failed to get visits");
	}

	const formatedReturn = visits.map((visitModel) =>
		IVisitModelToIVisit(visitModel)
	);

	return {
		status: 200,
		json: formatedReturn,
	};
}

export async function CreateVisit(
	req: ExpressRequest
): Promise<IRequestResponse<IRouteCreateVisit>> {
	let url: URL;
	// check inputs
	try {
		// TODO: This regex should allow only my domain
		const urlRegex = new RegExp(
			/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}(\.[a-zA-Z0-9()]{1,6})?\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/
		);
		if (
			!req.body.href ||
			typeof req.body.href !== "string" ||
			urlRegex.test(req.body.href) === false
		) {
			throw new Error("Inputs errors");
		}
		url = new URL(req.body.href);
	} catch {
		return {
			status: 400,
			json: {
				error: "Inputs errors",
			},
		};
	}

	const database = req.app.get("database") as IDatabase<ITelemetryApiQueries>;

	const visit = await database.queries.Visit.create({
		pagePath: url.pathname,
		date: new Date(),
	});
	if (!visit) {
		throw new Error("Failed to create visit");
	}

	return {
		status: 204,
	};
}
