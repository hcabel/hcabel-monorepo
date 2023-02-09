import { Schema, model, Model } from "mongoose";
import { IStatDocument, IStatSchema } from "@hcabel/types/ProjectApi";
import { I18nTextSchema } from "../schema";

const StatSchema = new Schema<
	IStatDocument,
	Model<IStatDocument, any, any>,
	IStatSchema
>({
	project_id: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	platform: {
		type: String,
		required: true,
	},
	name: {
		type: I18nTextSchema,
		required: true,
	},
	value: {
		type: Number,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
});

export const StatModel = model<IStatDocument>("stats", StatSchema);

export const Stat = {
	table: StatModel,
	schema: StatSchema,
};
