import mongoose from "mongoose";
import { IDatabase } from "@hcabel/rest-api-utils";

import * as queries from "./queries";
import { IQueries } from "@hcabel/types/ProjectApi";

function connect()
{
	return (
		mongoose.connect(process.env.MONGO_URI || "", {
			w: "majority",
			appName: "ProjectApi",
		})
			.then((mongoDatabase) => {
				// check if connection is successfull
				if (mongoDatabase.connection.readyState === 1 /* connected */) {
					return (true);
				}
				return (false);
			})
			.catch((error) => {
				console.error(error);
				return (false);
			})
	);
}

const database: IDatabase<IQueries> = {
	connect,
	queries: queries
};

export default database;