
import { Types } from 'mongoose';
import StatModel, { IStatModel } from '../models/stat';

/**
 * Create new stat in db
 * @param project_id id of the project the stat is related to
 * @param name name of the stat (view, download, ...)
 * @param platform platform of the stat (youtube, github, ...)
 * @param value value of the stat
 * @param url url to see the stat (youtube video link, github repo link, ...)
 * @returns the new stat
 */
export function CreateNewStat(
	project_id: Types.ObjectId,
	name: string,
	platform: string,
	value: number,
	url: string): Promise<IStatModel>
{
	return (
		StatModel.create({
			project_id: project_id,
			name: name,
			platform: platform,
			value: value,
			url: url
		})
	);
}

/**
 * Get a stat
 * @param project_id id of the project the stat is related to
 * @param statName name of the stat (view, download, ...)
 * @param platform platform of the stat (youtube, github, ...)
 * @returns the stat
 */
export function GetStat(project_id: Types.ObjectId, platform: string, statName: string): Promise<IStatModel | null>
{
	return (
		StatModel.findOne({ project_id: project_id, platform: platform, name: statName }).exec()
	);
}

/**
 * Get a stat from his id
 * @param id id of the stat
 * @returns the stat with the given id
 */
export function GetStatById(id: Types.ObjectId): Promise<IStatModel | null>
{
	return (
		StatModel.findById(id).exec()
	);
}

/**
 * Get all the stats from a project
 * @param project_id id of the project the stat is related to
 * @returns the stats of the project
 */
export function GetAllProjectStats(project_id: Types.ObjectId): Promise<IStatModel[]>
{
	return (
		StatModel.find({ project_id: project_id }).exec()
	);
}

/**
 * Get the stats of a platform for a project (all the stats from youtube or something)
 * @param project_id id of the project the stat is related to
 * @param platform platform of the stat (youtube, github, ...)
 * @returns the stats of the project for the given platform
 */
export function GetAllProjectStatsFromPlatform(project_id: Types.ObjectId, platform: string): Promise<IStatModel[]>
{
	return (
		StatModel.find({ project_id: project_id, platform: platform }).exec()
	);
}

/**
 * Update a stat value
 * @param project_id id of the project the stat is related to
 * @param statName name of the stat (view, download, ...)
 * @param platform platform of the stat (youtube, github, ...)
 * @param newValue new value of the stat
 * @returns true if stat has been updated, false otherwise
 */
export function UpdateStatValue(
	project_id: Types.ObjectId,
	statName: string,
	platform: string,
	newValue: number): Promise<boolean>
{
	return (
		StatModel.updateOne({ project_id: project_id, name: statName, platform: platform }, { value: newValue }).exec()
			.then((res) => {
				// if it matched one, we assume it updated it, so we return true
				return (res.matchedCount === 1);
			})
	);
}

/**
 * Update a stat url
 * @param project_id id of the project the stat is related to
 * @param statName name of the stat (view, download, ...)
 * @param platform platform of the stat (youtube, github, ...)
 * @param newUrl new url of the stat
 * @returns true if stat has been updated, false otherwise
 */
export function UpdateStatUrl(
	project_id: Types.ObjectId,
	statName: string,
	platform: string,
	newUrl: string): Promise<boolean>
{
	return (
		StatModel.updateOne({ project_id: project_id, name: statName, platform: platform }, { url: newUrl }).exec()
			.then((res) => {
				// if it matched one, we assume it updated it, so we return true
				return (res.matchedCount === 1);
			})
	);
}

/**
 * Remove a stat
 * @param project_id id of the project the stat is related to
 * @param statName name of the stat (view, download, ...)
 * @param platform platform of the stat (youtube, github, ...)
 * @returns true if stat has been deleted, false otherwise
 */
export function RemoveStat(project_id: Types.ObjectId, statName: string, platform: string): Promise<boolean>
{
	return (
		StatModel.deleteOne({ project_id: project_id, name: statName, platform: platform }).exec()
			.then((res) => {
				return (res.deletedCount === 1);
			})
	);
}

/**
 * Remove a stat from his id
 * @param id id of the stat that we want to delete
 * @returns true if stat has been deleted, false otherwise
 */
export function RemoveStatById(id: Types.ObjectId): Promise<boolean>
{
	return (
		StatModel.deleteOne({ _id: id }).exec()
			.then((res) => {
				return (res.deletedCount === 1);
			})
	);
}