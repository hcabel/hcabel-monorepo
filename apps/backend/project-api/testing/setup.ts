import { Types } from "mongoose";
import { IProjectModel } from "@hcabel/types/ProjectApi";
import { IStatModel } from "@hcabel/types/ProjectApi";

declare const global: any;

function generate_random_mongo_str_id() {
	// Create a random string of 12 bytes (24 hex characters)
	const hexString = [...Array(24)]
		.map(() => Math.floor(Math.random() * 16).toString(16))
		.join("");
	return hexString;
}

global.generate_random_mongo_str_id = generate_random_mongo_str_id;

function generate_random_text(wordCount: number): string {
	return [...Array(wordCount)]
		.map(() => Math.random().toString(36).substring(2, 15))
		.join(" ");
}
global.generate_random_text = generate_random_text;

function generate_random_project(): IProjectModel {
	const project: IProjectModel = {
		_id: new Types.ObjectId(generate_random_mongo_str_id()),
		// generate lorem ipsum
		name: generate_random_text(1),
		description: {
			en: generate_random_text(5),
			fr: generate_random_text(5),
		},
	};
	return project;
}
global.generate_random_project = generate_random_project;

function generate_random_project_array(count: number): IProjectModel[] {
	const projects: IProjectModel[] = [];
	for (let i = 0; i < count; i++) {
		projects.push(generate_random_project());
	}
	return projects;
}
global.generate_random_project_array = generate_random_project_array;

function generate_random_stat(project_id?: Types.ObjectId): IStatModel {
	if (!project_id) {
		project_id = new Types.ObjectId(generate_random_mongo_str_id());
	}
	const stat: IStatModel = {
		_id: new Types.ObjectId(generate_random_mongo_str_id()),
		project_id: project_id,
		platform: generate_random_text(1),
		name: {
			en: generate_random_text(1),
			fr: generate_random_text(1),
		},
		value: Math.floor(Math.random() * 100),
		url: generate_random_text(1),
	};
	return stat;
}
global.generate_random_stat = generate_random_stat;

function generate_random_stat_array(
	count: number,
	project_id?: Types.ObjectId
): IStatModel[] {
	const stats: IStatModel[] = [];
	for (let i = 0; i < count; i++) {
		stats.push(generate_random_stat(project_id));
	}
	return stats;
}
global.generate_random_stat_array = generate_random_stat_array;
