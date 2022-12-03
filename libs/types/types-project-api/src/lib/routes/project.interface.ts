import { IStats } from '../database';
import { IProject } from '../database/models/project.interface';

export type IRouteGetAllProjects = IProject[];
export type IRouteGetProjectById = IProject & { stats: IStats };