import { IProjectModel, IStatModel } from "../models/models.interface";

export interface IGetProjectInfos extends IProjectModel {
	stats: IStatModel[];
}