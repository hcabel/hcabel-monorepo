
import { IProjectSchema, IProjectDocument, IProjectModel} from "./models/project.interface";
import { IStatSchema, IStatDocument, IStatModel} from "./models/stat.interface";
import { Dotnation } from "../utils/mongoose.interface";

export interface IQueries {
	Project: {
		create(data: IProjectSchema): Promise<IProjectDocument | null>,
		delete_one(filter: IProjectSchema): Promise<boolean | null>,
		read_single(filter: Partial<IProjectSchema>): Promise<IProjectModel | null>
		update_one(filter: Partial<IProjectSchema>, set: Partial<IProjectSchema>): Promise<IProjectModel | null>
	},
	Stat: {
		create(data: IStatSchema): Promise<IStatDocument | null>,
		delete_one(filter: IStatSchema): Promise<boolean | null>,
		read(filter: Partial<IStatSchema>): Promise<IStatModel[] | null>,
		read_single(filter: Partial<IStatSchema & Dotnation>): Promise<IStatModel | null>,
		update_one(filter: Partial<IStatSchema>, set: Partial<IStatSchema>): Promise<IStatModel | null>
	}
};