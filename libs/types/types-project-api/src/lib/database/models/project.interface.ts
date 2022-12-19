import Mongoose, { LeanDocument, Types } from 'mongoose';
import { II18nText } from '../../i18n.interface';

// The interface that I want
export interface IProjectSchema {
	name: string,				// The name of the project
	description: II18nText		// A short description of the project
}

// The interface that is return by the queries
export type IProjectDocument = IProjectSchema & Mongoose.Document<Types.ObjectId>;
// The interface that is stored in the database
export interface IProjectModel extends Omit<LeanDocument<IProjectDocument>, "id" | "_id"> {
	_id: Types.ObjectId
}

// Interface when the api is returning a single project
export interface IProject extends Omit<IProjectModel, "__v" |"_id"> {
	_id: string
}