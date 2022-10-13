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

		const port = process.env.PROJECTAPI_ENDPOINT?.split(':')[2] || 3333;
		const server = app.listen(port, async() => {
			console.log(`Listening at ${process.env.PROJECTAPI_ENDPOINT}`);
		});
		server.on("error", console.error);
	})
	.catch((err: any) => {
		console.error(err);
	});