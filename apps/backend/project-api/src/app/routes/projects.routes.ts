import Express from "express";
import { IRequestResponse } from "@hcabel/rest-api-utils";
import {
	IRouteGetAllProjects,
	IRouteGetProjectById,
} from "@hcabel/types/ProjectApi";
import { Types } from "mongoose";
import { IStatModelArrayToIStats } from "./utils/stats.utils";
import { IProjectApiDatabase } from "../../database/database";

export async function get_all_projects(
	req: Express.Request
): Promise<IRequestResponse<IRouteGetAllProjects>> {
	const filter = req.query;

	// Get Database
	const db = req.app.get("database") as IProjectApiDatabase;

	// Get all projects
	const projects = await db.queries.Project.read({});
	if (!projects) {
		throw new Error("Query failed while getting all projects");
	}

	const filteredProjects = projects.filter((project: any) => {
		for (const key in filter) {
			if (
				project.hasOwnProperty(key) === false ||
				project[key] !== filter[key]
			) {
				return false;
			}
		}
		return true;
	});

	return {
		status: 200,
		json: filteredProjects.map((project) => {
			return {
				...project,
				_id: project._id.toString(),
			};
		}),
	};
}

export async function get_project_by_id(
	req: Express.Request
): Promise<IRequestResponse<IRouteGetProjectById>> {
	// check inputs
	if (!req.params.id || !Types.ObjectId.isValid(req.params.id)) {
		return {
			status: 400,
			json: {
				error: "Invalid inputs",
			},
		};
	}

	const projectId = new Types.ObjectId(req.params.id);

	// Get Database
	const db = req.app.get("database") as IProjectApiDatabase;

	// Get project by id
	const project = await db.queries.Project.read_single({
		_id: projectId,
	});
	if (project === undefined) {
		return {
			status: 404,
			json: {
				error: "Project not found",
			},
		};
	} else if (!project) {
		throw new Error("Query failed while getting project by id");
	}

	const stats = await db.queries.Stat.read({
		project_id: projectId,
	});
	if (!stats) {
		throw new Error("Query failed while getting stats by project id");
	}

	return {
		status: 200,
		json: {
			...project,
			_id: project._id.toString(),
			stats: IStatModelArrayToIStats(stats),
		},
	};
}
