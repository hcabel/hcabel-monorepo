import { IRequestResponse } from "@hcabel/rest-api-utils";
import { Request } from "express";
import * as ProjectServices from "../database/services/project";
import * as StatServices from "../database/services/stat";

export async function GetAllProjectStatsFromPlatform(req: Request): Promise<IRequestResponse>
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
	const project = await ProjectServices.GetProjectByName(projectName);
	if (!project) {
		return ({
			status: 404,
			json: { message: "Project not found" }
		});
	}

	// find all stats of the project from the platform
	const platformStats = await StatServices.GetAllProjectStatsFromPlatform(project._id, statPlatform);
	if (!platformStats) {
		return ({
			status: 404,
			json: { message: "Stats not found" }
		});
	}

	return ({
		status: 200,
		json: platformStats
	});
}

export async function GetProjectStat(req: Request): Promise<IRequestResponse>
{
	const projectName = req.params.projectname;
	const statPlatform = req.params.platform;
	const statName = req.params.statname;

	// Check request inputs
	if (!projectName || !statPlatform || !statName) {
		return ({
			status: 400,
			json: { message: "Bad request" }
		});
	}

	// find project from his name
	const project = await ProjectServices.GetProjectByName(projectName);
	if (!project) {
		return ({
			status: 404,
			json: { message: "Project not found" }
		});
	}

	// find stat of the project from the platform and the stat name
	const stat = await StatServices.GetStat(project._id, statPlatform, statName);
	console.log(stat);
	if (!stat) {
		return ({
			status: 404,
			json: { message: "Stat not found" }
		});
	}

	return {
		status: 200,
		json: stat
	}
}

export async function GetAllProjectStats(req: Request): Promise<IRequestResponse>
{
	const projectName = req.params.projectname;

	// Check request inputs
	if (!projectName) {
		return ({
			status: 400,
			json: { message: "Bad request" }
		});
	}


	// find project from his name
	const project = await ProjectServices.GetProjectByName(projectName);
	if (!project) {
		return ({
			status: 404,
			json: { message: "Project not found" }
		});
	}

	// find all stats of the project
	const stats = await StatServices.GetAllProjectStats(project._id);
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