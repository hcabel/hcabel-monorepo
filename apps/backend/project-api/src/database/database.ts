import { IDatabase } from "@hcabel/rest-api-utils";
import { IProjectApiQueries } from "@hcabel/types/ProjectApi";
import mongoose from "mongoose";

import * as queries from "./queries";

function connect() {
	return mongoose
		.connect(process.env.MONGO_URI || "", {
			w: "majority",
			appName: "ProjectApi",
		})
		.then((mongoDatabase) => {
			// check if connection is successfull
			if (mongoDatabase.connection.readyState === 1 /* connected */) {
				return true;
			}
			return false;
		})
		.catch((error) => {
			console.error(error);
			return false;
		});
}

export type IProjectApiDatabase = IDatabase<IProjectApiQueries>;

const database: IDatabase<IProjectApiQueries> = {
	connect,
	queries: queries,
};

export default database;
