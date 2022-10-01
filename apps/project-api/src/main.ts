import * as express from "express";
import RouteTree from "./routes/routes";
import { GenerateRouterFromRoutingTree } from "@hcabel/rest-api-utils";

const app = express();

const router = GenerateRouterFromRoutingTree(RouteTree);
app.use('/', router);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
	console.log(`Listening at ${process.env.NX_PROJECTAPI_ENDPOINT}`);
});
server.on("error", console.error);
