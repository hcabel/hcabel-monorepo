import { useRoute, IRoutingTreeBranch } from '@hcabel/rest-api-utils';
import GetProjectInfos from './GetProjectInfos';

// Graph of all the routes in the API
// __self__ allow you to add a leaf to a branch but still be able to extend the branch

const RouteTree: IRoutingTreeBranch = {
	__self__: {
		get: useRoute(() => {
			return ({ status: 200, json: { message: "ProjectApi is running." } })
		})
	},
	":projectname": {
		__self__: {
			get: useRoute(GetProjectInfos),
		}
	},
};

export default RouteTree;