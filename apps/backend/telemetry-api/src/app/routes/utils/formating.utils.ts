import { IVisit, IVisitModel } from "@hcabel/types/TelemetryApi";

export function IVisitModelToIVisit(visit: IVisitModel): IVisit {
	const { _id, __v, date, ...rest } = visit;

	return {
		...rest,
		_id: _id.toString(),
		date: date.toISOString(),
	};
}

export function ConvertQueryToVisitFilter(query: any): Partial<IVisitModel> {
	const allowedField: { [key in keyof IVisitModel]?: boolean } = {
		_id: true,
		pagePath: true,
	};

	const filter: Partial<IVisitModel> = {};

	for (const key in query) {
		if ((allowedField as any)[key] === true) {
			filter[key as keyof IVisitModel] = query[key];
		}
	}

	return filter;
}
