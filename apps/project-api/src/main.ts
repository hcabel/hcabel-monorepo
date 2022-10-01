import * as express from "express";
import RouteTree from "./routes/routes";
import { GenerateAppRoutesFromTree } from "@hcabel/rest-api-utils";

const app = express();

GenerateAppRoutesFromTree(app, RouteTree);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
