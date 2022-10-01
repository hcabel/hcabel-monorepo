import { Request } from "express";

export interface IRequestResponse {
	status: number;
	json: any;
}

export type RequestHandler = (req: Request) => IRequestResponse | Promise<IRequestResponse>;