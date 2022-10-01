import { IRequestResponse } from "@hcabel/rest-api-utils";
import { Request } from "express";
import { GetProjectByName } from "../database/services/services";


async function GetProjectInfos(req: Request): Promise<IRequestResponse>
{
	const projectName = req.params.projectname;

	// Check request inputs
	if (!projectName) {
		return ({
			status: 400,
			json: { message: "Bad request" }
		});
	}

	const infos = await GetProjectByName(projectName);
	if (!infos) {
		return ({
			status: 404,
			json: { message: "Project not found" }
		});
	}

	return ({
		status: 200,
		json: infos
	});
}

export default GetProjectInfos;