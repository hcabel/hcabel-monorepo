import { IProject } from '../models/project.interface';
import { IStats } from '../models/stat.interface';

export interface IRouteGetProjectInfos extends IProject {
	stats: IStats;
}