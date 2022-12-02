import express from "express";
import helmet from "helmet";

import RouteTree from "../routes/tree";
import { GenerateRouterFromRoutingTree } from "@hcabel/rest-api-utils";

export function create_app(database: any)
{
	// Create app
	const app = express();

	// Setup middlewares security
	app.use(helmet());

	// Setup all my routes from the tree.ts file
	const router = GenerateRouterFromRoutingTree(RouteTree);
	app.use('/', router);

	// Set database to app
	app.set('database', database);

	// This line will add spaces in the json output of every request (using res.json())
	// this will result in more readable json in the browser
	app.set('json spaces', 2);

	return (app);
}

