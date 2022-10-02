import { IRequestResponse } from "@hcabel/rest-api-utils";
import { IGetProjectInfos } from "@hcabel/types/ProjectApi";
import { Request } from "express";
import * as ProjectService from "../database/services/services";
import * as StatService from "../database/services/stat";


async function GetProjectInfos(req: Request): Promise<IRequestResponse<IGetProjectInfos>>
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

	const result: IGetProjectInfos = {
		...project,
		stats: stats
	};
	return ({
		status: 200,
		json: result
	});
}

export default GetProjectInfos;