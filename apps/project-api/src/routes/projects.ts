import { IRequestResponse } from "@hcabel/rest-api-utils";
import { IGetProjectInfos, IStatModel, IStats } from "@hcabel/types/ProjectApi";
import Express from "express";
import * as ProjectService from "../database/services/services";
import * as StatService from "../database/services/stat";

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
	// convert stats to a more readable format (hash table)
	const statsTable: IStats = {};
	stats.forEach((stat: IStatModel) => {
		if (!statsTable[stat.platform]) {
			statsTable[stat.platform] = [];
		}

		// I spread the object to remove all the omitted fields
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { project_id, ...statInfos } = stat;

		statsTable[stat.platform].push(statInfos);
	});

	return ({
		status: 200,
		json: {
			...project,
			stats: statsTable
		}
	});
}

export default GetProjectInfos;