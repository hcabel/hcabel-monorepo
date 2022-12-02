import { IProject } from '../database/models/project.interface';
import { IStats } from '../database/models/stat.interface';

export interface IRouteGetProjectInfos extends IProject {
	stats: IStats;
}