import Mongoose, { LeanDocument, Types } from 'mongoose';
import { II18nText } from '../i18n.interface';

// The interface that I want
export interface IProjectSchema {
	name: string,				// The name of the project
	description: II18nText		// A short description of the project
}

// The interface that is return by the queries
export type IProjectDocument = IProjectSchema & Mongoose.Document<Types.ObjectId>;
// The interface that is stored in the database
export type IProjectModel = LeanDocument<IProjectDocument>;

// Interface when the api is returning a single project
export type IProject = IProjectSchema;