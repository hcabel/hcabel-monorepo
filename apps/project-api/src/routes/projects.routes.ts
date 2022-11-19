import Express from "express";
import { IRequestResponse } from "@hcabel/rest-api-utils";
import { IRouteGetProjectInfos } from "@hcabel/types/ProjectApi";

import * as Queries from "../database/queries";

import { IStatModelArrayToIStats } from "./utils/stats.utils";
import { IProjectModelArrayToIProjects } from "./utils/project.utils";

export async function get_project_infos(req: Express.Request): Promise<IRequestResponse<IRouteGetProjectInfos>>
{
	const { params: { projectname }} = req;

	// Check request inputs
	if (!projectname) {
		return ({
			status: 400,
			json: { message: "Bad request" }
		});
	}

	// get project
	const project = await Queries.Project.read_single({
		name: projectname
	});
	if (!project) {
		return ({
			status: 404,
			json: { message: "Project not found" }
		});
	}

	// get projects stats
	const stats = await Queries.Stat.read({
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
		json: {
			...IProjectModelArrayToIProjects(project),
			stats: IStatModelArrayToIStats(stats)
		}
	});
}