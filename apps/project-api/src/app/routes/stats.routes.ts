import Express from "express";

import { IRequestResponse } from "@hcabel/rest-api-utils";
import {
	IProjectApiDatabase,
	IRouteGetAllProjectPlatformStats,
	IRouteGetProjectStat,
	IRouteGetProjectStats
} from "@hcabel/types/ProjectApi";

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

	// Get database
	const db = req.app.get('database') as IProjectApiDatabase;

	// find project from his name
	const projects = await db.queries.Project.read({
		name: projectname
	});
	if (!projects || projects.length === 0) {
		return ({
			status: 404,
			json: { message: "Project not found" }
		});
	}

	if (projects.length > 1) {
		return ({
			status: 409,
			json: { message: "Filter is not specific enough" }
		});
	}
	const project = projects[0];

	// find all stats of the project from the platform
	const platformStats = await db.queries.Stat.read({
		project_id: project._id,
		platform: platform
	});
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

	// Get database
	const db = req.app.get('database') as IProjectApiDatabase;

	// find project from his name
	const projects = await db.queries.Project.read({
		name: projectname
	});
	if (!projects || projects.length === 0) {
		return ({
			status: 404,
			json: { message: "Project not found" }
		});
	}

	if (projects.length > 1) {
		return ({
			status: 409,
			json: { message: "Filter is not specific enough" }
		});
	}
	const project = projects[0];

	// find stat of the project from the platform
	const stat = await db.queries.Stat.read_single({
		project_id: project._id,
		platform: platform,
		"name.en": statname
	});
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

	// Get database
	const db = req.app.get('database') as IProjectApiDatabase;

	// find project from his name
	const projects = await db.queries.Project.read({
		name: projectname
	});
	if (!projects || projects.length === 0) {
		return ({
			status: 404,
			json: { message: "Project not found" }
		});
	}

	if (projects.length > 1) {
		return ({
			status: 409,
			json: { message: "Filter is not specific enough" }
		});
	}
	const project = projects[0];

	// find all stats of the project
	const stats = await db.queries.Stat.read({
		project_id: project._id
	});
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