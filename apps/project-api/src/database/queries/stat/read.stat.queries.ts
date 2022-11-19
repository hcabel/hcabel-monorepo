import { Dotnation, IStatModel, IStatSchema } from "@hcabel/types/ProjectApi";
import { Stat } from "../../models";

/**
 * Read all the stats in the data that match the filter
 * @param {Partial<IStatSchema>} filter the data needed to find all the stats to read
 * @returns {Promise<IStatModel[]> | null} The stats found OR null if the query failed
 */
export function read(filter: Partial<IStatSchema>): Promise<IStatModel[] | null>
{
	return (
		Stat.table
			.find(filter)
			.lean()
			.exec()
			.catch((error) => {
				console.error(error);
				return (null);
			})
	);
}

/**
 * Read a single stat in the data that match the filter
 * @param filter {Partial<IStatSchema>} the data needed to find the stat to read
 * @returns {Promise<IStatModel> | null} The stat found OR null if the query failed
 */
export function read_single(filter: Partial<IStatSchema & Dotnation>): Promise<IStatModel | null>
{
	return (
		Stat.table
			.findOne(filter)
			.lean()
			.exec()
			.catch((error: any) => {
				console.error(error);
				return (null);
			})
	);
}