import Mongoose from 'mongoose';
import { IModel } from './models.interface';

// The interface that I want
export interface IProjectSchema {
	name: string,			// The name of the project
	description: string,	// A short description of the project
}

// The interface that is stored in the database
export type IProjectModel = IProjectSchema & IModel;

// The interface that is return by the queries
export type IProjectDocument = Mongoose.Document<any, any, IProjectModel>;