import { useRoute, IRoutingTreeBranch } from "@hcabel/rest-api-utils";
import { CreateVisit, GetAllVisit } from "./visit.routes";

// Graph of all the routes in the API
// __self__ allow you to add a leaf to a branch but still be able to extend the branch

const RouteTree: IRoutingTreeBranch = {
	__self__: {
		get: useRoute(async () => ({
			status: 200,
			json: { message: "Telemetry API is watching you ! 👁️👁️" },
		})),
	},
	visits: {
		get: useRoute(GetAllVisit),
		post: useRoute(CreateVisit),
	},
};

export default RouteTree;
