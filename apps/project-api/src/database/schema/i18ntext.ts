import { Schema } from "mongoose";

export const I18nTextSchema = new Schema({
	fr: {
		type: String,
		required: true
	},
	en: {
		type: String,
		required: true
	}
}, { _id: false, versionKey: false });