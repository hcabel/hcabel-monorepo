import Express from 'express';
import { RequestHandler } from './request';

export type RequestMethod = "get" | "post" | "put" | "delete" | "patch" | "options" | "head";

/**
 * An interface to represent a leaf of your tree of routes.
 */
export interface IRouteLeaf {
	get?: Express.RequestHandler,
	post?: Express.RequestHandler,
	put?: Express.RequestHandler,
	patch?: Express.RequestHandler,
	delete?: Express.RequestHandler,
}

/**
 * This wrapper protect your route in case of error and other stuff like that.
 * @param callee The function that will be called when the route is accessed
 * @returns A function that will be called by express
 */
export function useRoute(callee: RequestHandler): Express.RequestHandler
{
	// we wrap the function, so we can catch errors, facilitate the function, assure some behavior, etc.
	return async(req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
		try {
			const result = await callee(req);
			res.status(result.status).json(result.json);
			next();
		}
		catch {
			console.error(`${req.route.path}: CRASHED`);
			res.status(500).json({ message: "Internal server error" });
		}
	};
}

/**
 * This interface represent a branch of your tree of routes.
 * technically the stump if the first branch of your tree.
 */
export type IRoutingTreeBranch = { [name: string]: IRoutingTreeBranch | IRouteLeaf };

/**
 * This function will generate all the routes from a tree of routes.
 * @param app The express app
 * @param branchNode The branch of the tree of routes
 * @param path The starting path of the branch, '' by default
 */
export function GenerateRouterFromRoutingTree(RoutingTree: IRoutingTreeBranch): Express.Router
{
	const router = Express.Router();

	function GenerateRoutesFromBranch(RoutingBranch: IRoutingTreeBranch, path: string)
	{
		// for each branches of RoutingBranch
		for (const branchName in RoutingBranch) {
			// get the branch value
			const branchValue = RoutingBranch[branchName];

			// if branchName is a method, it's the end of this branch, branchValue = RequestHandler
			if (["get", "post", "put", "delete", "patch", "options", "head"].includes(branchName)) {

				if (branchValue) {
					router[branchName as RequestMethod](path, branchValue as RequestHandler);
				}
				else {
					throw Error(`No RequestHandler for ${branchName} at ${path}!`);
				}
			}
			// Self is the object where are the RequestHandler for the current path
			else if (branchName === "__self__") {
				// Dive deeper but without incrementing the path
				GenerateRoutesFromBranch(branchValue as IRoutingTreeBranch, path);
			}
			// Otherwise the branch continue, add current branchName to the path and dive deeper
			else {
				GenerateRoutesFromBranch(branchValue as IRoutingTreeBranch, `${path}/${branchName}`);
			}
		}
	}
	GenerateRoutesFromBranch(RoutingTree, '');

	return (router);
}