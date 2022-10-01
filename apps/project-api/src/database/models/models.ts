import { Types } from 'mongoose';

export * from './project';

// This interface contain all the field automatically added by mongoose
// (your model interface should extend this interface)
export interface IModel {
	_id: Types.ObjectId,
	__v: number,
}