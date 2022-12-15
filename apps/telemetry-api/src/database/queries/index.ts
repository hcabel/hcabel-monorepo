import { ITelemetryApiQueries } from "@hcabel/types/TelemetryApi";

// Visit model queries
import * as VisitCreate from "./visit/create.visit.queries";
import * as VisitRead from "./visit/read.visit.queries";
import * as VisitUpdate from "./visit/update.visit.queries";
import * as VisitDelete from "./visit/delete.visit.queries";

const queries: ITelemetryApiQueries = {
	Visit: {
		create: VisitCreate.create,
		read: VisitRead.read,
		read_one: VisitRead.read_one,
		update_one: VisitUpdate.update_one,
		delete_one: VisitDelete.delete_one
	}
}

export default queries;