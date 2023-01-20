import { IStat, IStatModel, IStats } from "@hcabel/types/ProjectApi";

/**
 * Convert a stat model to a stat, by removing omitted fields.
 * @param stat the stat to convert
 * @returns the converted stat
 */
export function IStatModelToIStat(stat: IStatModel): IStat {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { _id, __v, project_id, platform, ...statInfos } = stat;
	return {
		...statInfos,
		_id: _id?.toString() || "",
	};
}

/**
 * Convert an array of IStatModel to an hastable of IStat with the platform as key.
 * We do this because it's easier to handle for the clients
 * @param stats the stat array to convert
 * @returns a hash table of stats (platform = key)
 */
export function IStatModelArrayToIStats(stats: IStatModel[]): IStats {
	const statsTable: IStats = {};
	stats.forEach((stat: IStatModel) => {
		if (!statsTable[stat.platform]) {
			statsTable[stat.platform] = [];
		}
		statsTable[stat.platform].push(IStatModelToIStat(stat));
	});
	return statsTable;
}
