import Express from 'express';

export interface IRequestError {
	message: string;
}

export interface IRequestResponse<T> {
	status: number;
	json: T | IRequestError;
}

export type RequestHandler = (req: Express.Request) => IRequestResponse<any> | Promise<IRequestResponse<any>>;