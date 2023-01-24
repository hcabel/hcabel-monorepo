
import {
	IRouteGetAllProjects,
	IRouteGetProjectById,
} from "@hcabel/types/ProjectApi";

export function get_all_projects(queryParamsFilter: `?${string}`,  options?: RequestInit): Promise<IRouteGetAllProjects>
{
	return (
		fetch(
			`${process.env.NX_PROJECT_API_ENDPOINT}/projects${queryParamsFilter || ''}`,
			options || {}
		)
		.then((res) => res.json() as Promise<IRouteGetAllProjects>)
	)
}
export function get_single_project(projectId: string, options?: RequestInit): Promise<IRouteGetProjectById> {
	// fetch the project data from the api
	return (
		fetch(
			`${process.env.NX_PROJECT_API_ENDPOINT}/projects/${projectId}`,
			options || {}
		)
		.then((res) => res.json() as Promise<IRouteGetProjectById>)
	);
}
