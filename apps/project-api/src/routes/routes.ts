import { Request, Response } from 'express';
import { useRoute, IRoutingTreeBranch } from '@hcabel/rest-api-utils';

// Graph of all the routes in the API
// __self__ allow you to add a leaf to a branch but still be able to extend the branch

const RouteTree: IRoutingTreeBranch = {
	__self__: {
		get: useRoute((req: Request, res: Response) => {
			res.send({ message: "ProjectApi is running." });
		}),
	},
	project: {
		hugomeet: {
			get: useRoute((req: Request, res: Response) => {
				res.send({ message: "hugomeet infos test" });
			}),
		},
	},
	":testname": {
		get: useRoute((req: Request, res: Response) => {
			res.send({ message: `test ${req.params.testname}`  });}
		),
	}
};

export default RouteTree;