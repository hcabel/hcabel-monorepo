import { IModel } from './models.interface';

// Project model interface
export interface IProjectModel extends IModel{
	name: string,			// The name of the project
	description: string,	// A short description of the project
}