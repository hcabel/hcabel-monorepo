import { Request } from "express";

export interface IRequestError {
	message: string;
}

export interface IRequestResponse<T = any> {
	status: number;
	json: T | IRequestError;
}

export type RequestHandler = (req: Request) => IRequestResponse | Promise<IRequestResponse>;