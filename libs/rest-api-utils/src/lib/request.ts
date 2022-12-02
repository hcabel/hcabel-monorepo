import Express from 'express';

export interface IRequestError {
	message: string;
}

export interface IRequestResponse<T> {
	status: number;
	json?: T | IRequestError;
}

export type RequestHandler<T = any> = (req: Express.Request) => Promise<IRequestResponse<T>>;