import { Types, Schema, model } from 'mongoose';
import { IStatModel } from '@hcabel/types/ProjectApi';
import { I18nTextSchema } from '../schema/i18ntext';

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
		type: I18nTextSchema,
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