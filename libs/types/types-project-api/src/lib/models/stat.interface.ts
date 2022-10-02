import { Document, Types } from "mongoose";
import { IModel } from "./models.interface";

// The interface that I want
export interface IStatSchema {
	project_id: Types.ObjectId;	// The project were the stat is from
	platform: string;			// the platform of the stat (youtube, github, marketplace, ...)
	name: string;				// the name of the stat (view, download, ...)
	value: number;				// the value of the stat
	url: string;				// the url of the stat, were to see the stat (youtube video, github repo, marketplace extension, ...)
}

// The interface that is stored in the database
export type IStatModel = IStatSchema & IModel;

// The interface that is return by the queries
export type IStatDocument = Document<any, any, IStatModel>;