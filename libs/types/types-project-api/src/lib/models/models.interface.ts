import { Types } from 'mongoose';

// This interface contain all the field automatically added by mongoose
// (your model interface should extend this interface)
export interface IModel {
	_id: Types.ObjectId,
	__v?: number,
}

export * from './project.interface';
export * from './stat.interface';