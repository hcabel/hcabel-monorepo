import { Schema, model, Model } from 'mongoose';
import { IVisitDocument, IVisitSchema } from '@hcabel/types/TelemetryApi';

const VisitSchema =
	new Schema<IVisitDocument, Model<IVisitDocument, any, any>, IVisitSchema>({
		pagePath: {
			type: String,
			required: true
		},
		date: {
			type: Date,
			required: true
		}
	});

const VisitModel = model<IVisitDocument>("visits", VisitSchema);

export const Visit = {
	table: VisitModel,
	schema: VisitSchema
};