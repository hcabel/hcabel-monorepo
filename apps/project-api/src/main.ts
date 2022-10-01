import * as express from "express";
import mongoose from "mongoose";

import RouteTree from "./routes/routes";
import { GenerateRouterFromRoutingTree } from "@hcabel/rest-api-utils";

const app = express();

const router = GenerateRouterFromRoutingTree(RouteTree);
app.use('/', router);

const dbUri = process.env.NX_MONGO_URI;
mongoose.connect(dbUri || "", {
	w: "majority",
	appName: "ProjectApi",
}, () => {
	console.log('Mongo ready');

	const port = process.env.port || 3333;
	const server = app.listen(port, () => {
		console.log(`Listening at ${process.env.PROJECTAPI_ENDPOINT}`);
	});
	server.on("error", console.error);
});