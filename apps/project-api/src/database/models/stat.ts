import { Types, Schema, model } from 'mongoose';
import { IStatModel } from '@hcabel/types/ProjectApi';

const StatSchema = new Schema({
	project_id: {
		type: Types.ObjectId,
		required: true
	},
	platform: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	value: {
		type: Number,
		required: true
	},
	url: {
		type: String,
		required: true
	}
});

export const StatModel = model<IStatModel>('stats', StatSchema);
export default StatModel;