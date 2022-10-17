import * as express from "express";
import mongoose from "mongoose";
import helmet from "helmet";

import RouteTree from "./routes/routes";
import { GenerateRouterFromRoutingTree } from "@hcabel/rest-api-utils";

const app = express();

app.use(helmet());

const router = GenerateRouterFromRoutingTree(RouteTree);
app.use('/', router);

// This line will add spaces in the json output of every request (using res.json())
// this will result in more readable json in the browser
app.set('json spaces', 2);

const dbUri = process.env.MONGO_URI;
mongoose.connect(dbUri || "", {
	w: "majority",
	appName: "ProjectApi",
})
	.then(() => {
		console.log('Mongo ready');

		const port = process.env.NX_PROJECT_API_ENDPOINT!.match(/:(\d+)/)?.[1];
		app.listen({ port: parseInt(port!), },
			async() => {
				console.log(`Running at ${process.env.NX_PROJECT_API_ENDPOINT}`);
			})
			.on("error", console.error);
	})
	.catch((err: any) => {
		console.error(err);
	});