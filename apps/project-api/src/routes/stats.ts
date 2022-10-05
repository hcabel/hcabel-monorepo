import Express from "express";
import { IRequestResponse } from "@hcabel/rest-api-utils";
import { IRouteGetAllProjectPlatformStats, IRouteGetProjectStat, IRouteGetProjectStats, IStatModel, IStats } from "@hcabel/types/ProjectApi";

import * as ProjectServices from "../database/services/project";
import * as StatServices from "../database/services/stat";

export async function GetAllProjectPlatformStats(req: Express.Request): Promise<IRequestResponse<IRouteGetAllProjectPlatformStats>>
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
		json: platformStats.map((stat) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { _id, __v, project_id, platform, ...statInfo } = stat;
			return (statInfo);
		})
	});
}

export async function GetProjectStat(req: Express.Request): Promise<IRequestResponse<IRouteGetProjectStat>>
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
	if (!stat) {
		return ({
			status: 404,
			json: { message: "Stat not found" }
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { _id, __v, project_id, platform, ...statInfo } = stat;

	return {
		status: 200,
		json: statInfo
	};
}

export async function GetProjectStats(req: Express.Request): Promise<IRequestResponse<IRouteGetProjectStats>>
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

	// convert stats to a more readable format (hash table)
	const statsTable: IStats = {};
	stats.forEach((stat: IStatModel) => {
		if (!statsTable[stat.platform]) {
			statsTable[stat.platform] = [];
		}

		// I spread the object to remove all the omitted fields
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { _id, __v, project_id, platform, ...statInfos } = stat;

		statsTable[stat.platform].push(statInfos);
	});

	return ({
		status: 200,
		json: statsTable
	});
}