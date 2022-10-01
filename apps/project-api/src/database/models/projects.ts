import {Schema, Types, model} from 'mongoose';

// Project interface Schemat
export interface ISProject {
	userId: Types.ObjectId,
	value: string,
	expirationDate: number
}

const ProjectSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	stats: {
		type: [Types.ObjectId],
		required: false,
		default: []
	}
});

// Project interface model (because by default mongo add a _id field)
export interface IMProject extends ISProject {
	_id: Types.ObjectId
}

export default model<IMProject>("tokens", ProjectSchema);