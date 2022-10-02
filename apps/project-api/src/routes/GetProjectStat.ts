import { IRequestResponse } from "@hcabel/rest-api-utils";
import { Request } from "express";
import { GetProjectByName } from "../database/services/project";
import { GetAllProjectStatsFromPlateform } from "../database/services/stat";

export async function GetProjectStat(req: Request): Promise<IRequestResponse>
{
	const projectName = req.params.projectname;
	const statPlatform = req.params.platform;

	// Check request inputs
	if (!projectName || !statPlatform) {
		return ({
			status: 400,
			json: { message: "Bad request" }
		});
	}

	// find project from his name
	const project = await GetProjectByName(projectName);
	if (!project) {
		return ({
			status: 404,
			json: { message: "Project not found" }
		});
	}

	// find all stats of the project from the platform
	const stats = await GetAllProjectStatsFromPlateform(project._id, statPlatform);
	if (!stats) {
		return ({
			status: 404,
			json: { message: "Stats not found" }
		});
	}

	return ({
		status: 200,
		json: stats
	});
}