import Mongoose from "mongoose";
import { II18nText } from "../i18n";
import { IModel } from "./models.interface";

// The interface that I want
export interface IStatSchema {
	project_id: Mongoose.Types.ObjectId;	// The project were the stat is from
	platform: string;						// the platform of the stat (youtube, github, marketplace, ...)
	name: II18nText;						// the name of the stat (view, download, ...)
	value: number;							// the value of the stat
	url: string;							// the url of the stat, were to see the stat (youtube video, github repo, marketplace extension, ...)
}

// The interface that is stored in the database
export type IStatModel = IStatSchema & IModel;

// The interface that is return by the queries
export type IStatDocument = Mongoose.Document<any, any, IStatModel>;

// Interface when the api is returning a single stat
export type IStat = Omit<IStatSchema, "project_id" | "platform">;

// Interface when the api is returning multiple stats
export interface IStats {
	[platform: string]: IStat[]
}