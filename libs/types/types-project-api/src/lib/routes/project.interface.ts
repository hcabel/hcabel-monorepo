import { IProject } from '../models/project.interface';
import { IStats } from '../models/stat.interface';

export interface IGetProjectInfos extends IProject {
	stats: IStats;
}