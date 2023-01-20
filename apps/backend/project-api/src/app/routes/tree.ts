import { useRoute, IRoutingTreeBranch } from "@hcabel/rest-api-utils";
import { get_all_projects, get_project_by_id } from "./projects.routes";

// Graph of all the routes in the API
// __self__ allow you to add a leaf to a branch but still be able to extend the branch

const RouteTree: IRoutingTreeBranch = {
	__self__: {
		get: useRoute(async () => {
			return { status: 200, json: { message: "ProjectApi is running." } };
		}),
	},
	projects: {
		__self__: {
			get: useRoute(get_all_projects),
		},
		":id": {
			get: useRoute(get_project_by_id),
		},
	},
};

export default RouteTree;
