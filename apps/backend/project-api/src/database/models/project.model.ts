import { Schema, model, Model } from "mongoose";
import { IProjectDocument, IProjectSchema } from "@hcabel/types/ProjectApi";
import { I18nTextSchema } from "../schema";

const ProjectSchema = new Schema<
	IProjectDocument,
	Model<IProjectDocument, any, any>,
	IProjectSchema
>({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: I18nTextSchema,
		required: true,
	},
});

const ProjectModel = model<IProjectDocument>("projects", ProjectSchema);

export const Project = {
	table: ProjectModel,
	schema: ProjectSchema,
};
