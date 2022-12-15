import { IVisitDocument, IVisitModel, IVisitSchema } from "./models/visit.interface"

export interface ITelemetryApiQueries {
	Visit: {
		create(data: IVisitSchema): Promise<IVisitDocument | null>,
		delete_one(filter: Partial<IVisitModel>): Promise<boolean | null>,
		read(filter: Partial<IVisitModel>): Promise<IVisitModel[] | null>,
		read_single(filter: Partial<IVisitModel>): Promise<IVisitModel | null>
		update_one(filter: Partial<IVisitModel>, set: Partial<IVisitSchema>): Promise<IVisitModel | null>
	}
};