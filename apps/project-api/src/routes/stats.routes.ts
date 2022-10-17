import Express from "express";
import { IRequestResponse } from "@hcabel/rest-api-utils";
import { IRouteGetAllProjectPlatformStats, IRouteGetProjectStat, IRouteGetProjectStats } from "@hcabel/types/ProjectApi";

import { ProjectServices, StatServices } from "../database/services";
import { IStatModelArrayToIStats, IStatModelToIStat } from "./utils/stats.utils";

export async function GetAllProjectPlatformStats(req: Express.Request): Promise<IRequestResponse<IRouteGetAllProjectPlatformStats>>
{
	const { params: { projectname, platform }} = req;

	// Check request inputs
	if (!projectname || !platform) {
		return ({
			status: 400,
			json: { message: "Bad request" }
		});
	}

	// find project from his name
	const project = await ProjectServices.GetProjectByName(projectname);
	if (!project) {
		return ({
			status: 404,
			json: { message: "Project not found" }
		});
	}

	// find all stats of the project from the platform
	const platformStats = await StatServices.GetAllProjectStatsFromPlatform(project._id, platform);
	if (!platformStats) {
		return ({
			status: 404,
			json: { message: "Stats not found" }
		});
	}

	return ({
		status: 200,
		json: platformStats.map((stat) => {
			return (IStatModelToIStat(stat));
		})
	});
}

export async function GetProjectStat(req: Express.Request): Promise<IRequestResponse<IRouteGetProjectStat>>
{
	const { params: { projectname, platform, statname }} = req;

	// Check request inputs
	if (!projectname || !platform || !statname) {
		return ({
			status: 400,
			json: { message: "Bad request" }
		});
	}

	// find project from his name
	const project = await ProjectServices.GetProjectByName(projectname);
	if (!project) {
		return ({
			status: 404,
			json: { message: "Project not found" }
		});
	}

	// find stat of the project from the platform and the stat name
	const stat = await StatServices.GetStat(project._id, platform, statname);
	if (!stat) {
		return ({
			status: 404,
			json: { message: "Stat not found" }
		});
	}

	return {
		status: 200,
		json: IStatModelToIStat(stat)
	};
}

export async function GetProjectStats(req: Express.Request): Promise<IRequestResponse<IRouteGetProjectStats>>
{
	const { params: { projectname }} = req;

	// Check request inputs
	if (!projectname) {
		return ({
			status: 400,
			json: { message: "Bad request" }
		});
	}

	// find project from his name
	const project = await ProjectServices.GetProjectByName(projectname);
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
		json: IStatModelArrayToIStats(stats)
	});
}