import { IRouteGetProjectById } from "@hcabel/types/ProjectApi";

export function GetProjectData(
	projectId: string,
	options?: RequestInit
): Promise<IRouteGetProjectById> {
	// fetch the project data from the api
	return fetch(
		`${process.env.NX_PROJECT_API_ENDPOINT}/projects/${projectId}`,
		options
	).then((res) => res.json() as Promise<IRouteGetProjectById>);
}
