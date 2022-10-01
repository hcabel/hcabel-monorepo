
import { Express, Request, Response, NextFunction, RequestHandler, Router } from 'express';

export type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

/**
 * An interface to represent a leaf of your tree of routes.
 */
interface IRouteLeaf {
	get?: RequestHandler,
	post?: RequestHandler,
	put?: RequestHandler,
	patch?: RequestHandler,
	delete?: RequestHandler,
}

/**
 * This wrapper protect your route in case of error and other stuff like that.
 * @param callee The function that will be called when the route is accessed
 * @returns A function that will be called by express
 */
export function useRoute(callee: RequestHandler): RequestHandler
{
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			callee(req, res, next);
		}
		catch {
			console.log('error');
		}
	};
}

/**
 * This wrapper convert your leaf and all his handler in a router that can be used by express.
 * @param leaf The leaf of the route tree
 * @returns The router of the leaf
 */
export function useLeaf(leaf: IRouteLeaf)
{
	const router: Router = Router();

	for (const key in leaf) {
		const method = key as keyof IRouteLeaf;
		const handler = leaf[method];
		if (handler) {
			router[method as RequestMethod]('/', handler);
		}
	}

	return (router);
}

/**
 * This interface represent a branch of your tree of routes.
 * technically the stump if the first branch of your tree.
 */
export type IRoutesTreeBranch = { [name: string]: IRoutesTreeBranch | Router };

/**
 * This function will generate all the routes from a tree of routes.
 * @param app The express app
 * @param branchNode The branch of the tree of routes
 * @param path The starting path of the branch, '' by default
 */
export function GenerateAppRoutesFromTree(app: Express, treeBranch: IRoutesTreeBranch, path = '')
{
	// for each branches which is leaving this node
	for (const branchName in treeBranch) {
		// get one of the branches
		const branch = treeBranch[branchName];

		// if the branch got other branches, dive into this branch
		if (typeof(branch) === "object") {
			GenerateAppRoutesFromTree(app, branch, `${path}/${branchName}`);
		}
		// else branch is in fact a leaf(route), so added it to the express app
		else {
			// if branchName is self this mean that sould be the route of treeBranch
			if (branchName === "__self__") {
				app.use(path, branch);
				console.log(`+ ${path}/`);
			}
			else {
				app.use(`${path}/${branchName}`, branch);
				console.log(`+ ${path}/${branchName}`);
			}
		}
	}
}