import { Types, Schema, model } from 'mongoose';
import { IModel } from './models';

// Stat model interface
export interface IStatModel extends IModel {
	project_id: Types.ObjectId;	// The project were the stat is from
	name: string;				// the name of the stat (view, download, ...)
	platform: string;			// the platform of the stat (youtube, github, marketplace, ...)
	value: number;				// the value of the stat
	url: string;				// the url of the stat, were to see the stat (youtube video, github repo, marketplace extension, ...)
}

const StatSchema = new Schema({
	project_id: {
		type: Types.ObjectId,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	platform: {
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

export const StatModel = model<IStatModel>('Stat', StatSchema);
export default StatModel;