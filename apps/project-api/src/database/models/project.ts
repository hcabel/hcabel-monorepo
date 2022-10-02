import { Schema, model } from 'mongoose';
import { IProjectModel } from '@hcabel/types/ProjectApi';

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