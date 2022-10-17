import { Schema, model } from 'mongoose';
import { IProjectModel } from '@hcabel/types/ProjectApi';
import { I18nTextSchema } from '../schema';

const ProjectSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: I18nTextSchema,
		required: true
	}
});

export const ProjectModel = model<IProjectModel>("projects", ProjectSchema);
export default ProjectModel;