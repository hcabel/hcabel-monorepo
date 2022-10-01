import {Schema, Types, model} from 'mongoose';

// Project interface Schemat
export interface ISProject {
	name: string,
	description: string,
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

// Project interface model (because by default mongo add a _id field)
export interface IMProject extends ISProject {
	_id: Types.ObjectId,
}

export const Project = model<IMProject>("Project", ProjectSchema);

export default Project;