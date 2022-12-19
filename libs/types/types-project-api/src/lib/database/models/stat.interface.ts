import Mongoose, { LeanDocument, Types } from "mongoose";
import { II18nText } from "../../i18n.interface";

// The interface that I want
export interface IStatSchema {
	project_id: Mongoose.Types.ObjectId;	// The project were the stat is from
	platform: string;						// the platform of the stat (youtube, github, marketplace, ...)
	name: Partial<II18nText>;				// the name of the stat (view, download, ...)
	value: number;							// the value of the stat
	url: string;							// the url of the stat, were to see the stat (youtube video, github repo, marketplace extension, ...)
}

// The interface that is return by the queries
export type IStatDocument = IStatSchema & Mongoose.Document<Types.ObjectId>;
// The interface that is stored in the database
export interface IStatModel extends Omit<LeanDocument<IStatDocument>, "id" | "_id"> {
	_id: Types.ObjectId
}

// Interface when the api is returning a single stat
export interface IStat extends Omit<IStatModel, "__v" | "project_id" | "platform" | "_id"> {
	_id: string,
}

// Interface when the api is returning multiple stats
export interface IStats {
	[platform: string]: IStat[]
}