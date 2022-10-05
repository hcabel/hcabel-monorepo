import Express from "express";
import { IRequestResponse } from "@hcabel/rest-api-utils";
import { IGetProjectInfos } from "@hcabel/types/ProjectApi";

import * as ProjectService from "../database/services/services";
import * as StatService from "../database/services/stat";
import { IStatModelArrayToIStats } from "./utils/stats";

async function GetProjectInfos(req: Express.Request): Promise<IRequestResponse<IGetProjectInfos>>
{
	const projectName = req.params.projectname;

	// Check request inputs
	if (!projectName) {
		return ({
			status: 400,
			json: { message: "Bad request" }
		});
	}

	// get project
	const project = await ProjectService.GetProjectByName(projectName);
	if (!project) {
		return ({
			status: 404,
			json: { message: "Project not found" }
		});
	}

	// get projects stats
	const stats = await StatService.GetAllProjectStats(project._id);
	if (!stats) {
		return ({
			status: 404,
			json: { message: "Stats not found" }
		});
	}

	return ({
		status: 200,
		json: {
			...project,
			stats: IStatModelArrayToIStats(stats)
		}
	});
}

export default GetProjectInfos;