import * as express from "express";
import RouteTree from "./routes/routes";
import { GenerateAppRoutesFromTree } from "@hcabel/rest-api-utils";

const app = express();

GenerateAppRoutesFromTree(app, RouteTree);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
	console.log(`Listening at ${process.env.NX_PROJECTAPI_ENDPOINT}`);
});
server.on("error", console.error);
