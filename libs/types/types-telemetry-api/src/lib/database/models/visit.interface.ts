import Mongoose, { LeanDocument, Types } from 'mongoose';

// The interface that I want
export interface IVisitSchema {
	pagePath: string,
	date: Date
}

// The interface that is return by the queries
export type IVisitDocument = IVisitSchema & Mongoose.Document<Types.ObjectId>;
// The interface that is stored in the database
export interface IVisitModel extends Omit<LeanDocument<IVisitDocument>, "id" | "_id"> {
	_id: Types.ObjectId
}

// Interface when the api is returning a visit model
export interface IVisit extends Omit<IVisitModel, "__v" | "_id"> {
	_id: string
}