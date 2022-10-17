import Mongoose from 'mongoose';
import { II18nText } from '../i18n.interface';
import { IModel } from '.';

// The interface that I want
export interface IProjectSchema {
	name: string,				// The name of the project
	description: II18nText		// A short description of the project
}

// The interface that is stored in the database
export type IProjectModel = IProjectSchema & IModel;

// The interface that is return by the queries
export type IProjectDocument = Mongoose.Document<any, any, IProjectModel>;

// Interface when the api is returning a single project
export type IProject = IProjectSchema;