import { Schema, model } from 'mongoose';
import { IModel } from './models';

// Project model interface
export interface IProjectModel extends IModel{
	name: string,			// The name of the project
	description: string,	// A short description of the project
}

const ProjectSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	}
});

export const ProjectModel = model<IProjectModel>("projects", ProjectSchema);
export default ProjectModel;