import { IStatDocument, IStatSchema } from "@hcabel/types/ProjectApi";
import { Stat } from "../../models";

/**
 * Create a new stat
 * @param {IStatSchema} data the data needed to create a new stat
 * @returns {Promise<IStatDocument> | null} The new stat document created OR null if the query failed
 */
export function create(data: IStatSchema): Promise<IStatDocument | null> {
	return Stat.table.create(data).catch((error: any) => {
		console.error(error);
		return null;
	});
}
