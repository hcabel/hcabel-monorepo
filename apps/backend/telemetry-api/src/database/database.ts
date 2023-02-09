import { IDatabase } from "@hcabel/rest-api-utils";
import { ITelemetryApiQueries } from "@hcabel/types/TelemetryApi";
import mongoose from "mongoose";
import queries from "./queries";

function connect() {
	return mongoose
		.connect(process.env.MONGO_URI || "", {
			w: "majority",
			appName: "TelemetryApi",
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

export type ITelemetryApiDatabase = IDatabase<ITelemetryApiQueries>;

const database: IDatabase<any> = {
	connect,
	queries: queries,
};

export default database;
