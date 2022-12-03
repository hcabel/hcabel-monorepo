
import { IProjectSchema, IProjectDocument, IProjectModel} from "./models/project.interface";
import { IStatSchema, IStatDocument, IStatModel} from "./models/stat.interface";
import { Dotnation } from "../utils/mongoose.interface";
import { IDatabase } from "@hcabel/rest-api-utils";

export interface IProjectApiQueries {
	Project: {
		create(data: IProjectSchema): Promise<IProjectDocument | null>,
		delete_one(filter: Partial<IProjectModel>): Promise<boolean | null>,
		read(filter: Partial<IProjectModel>): Promise<IProjectModel[] | null>,
		read_single(filter: Partial<IProjectModel>): Promise<IProjectModel | null>
		update_one(filter: Partial<IProjectModel>, set: Partial<IProjectSchema>): Promise<IProjectModel | null>
	},
	Stat: {
		create(data: IStatSchema): Promise<IStatDocument | null>,
		delete_one(filter: IStatSchema): Promise<boolean | null>,
		read(filter: Partial<IStatSchema>): Promise<IStatModel[] | null>,
		read_single(filter: Partial<IStatSchema & Dotnation>): Promise<IStatModel | null>,
		update_one(filter: Partial<IStatSchema>, set: Partial<IStatSchema>): Promise<IStatModel | null>
	}
};

export type IProjectApiDatabase = IDatabase<IProjectApiQueries>;