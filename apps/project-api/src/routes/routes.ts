import { Request, Response } from 'express';
import { useRoute, useLeaf, IRoutesTreeBranch } from '@hcabel/rest-api-utils';

// Graph of all the routes in the API
// __self__ allow you to add a leaf to a branch but still be able to extend the branch

const RouteTree: IRoutesTreeBranch = {
	__self__: useLeaf({
		get: useRoute((req: Request, res: Response) => {
			res.send({ message: "ProjectApi is running." });
		}),
	}),
	project: {
		hugomeet: useLeaf({
			get: useRoute((req: Request, res: Response) => {
				res.send({ message: "hugomeet infos test" });}),
		}),
	}
};

export default RouteTree;