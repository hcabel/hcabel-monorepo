import { Types } from 'mongoose';
import { IVisitModel } from '@hcabel/types/TelemetryApi';

declare const global: any;

function generate_random_mongo_str_id()
{
	// Create a random string of 12 bytes (24 hex characters)
	const hexString = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
	return (hexString);
}

global.generate_random_mongo_str_id = generate_random_mongo_str_id;

function generate_random_text(wordCount: number): string
{
	return (
		[...Array(wordCount)].map(() => Math.random().toString(36).substring(2, 15)).join(' ')
	);
}
global.generate_random_text = generate_random_text;


function generate_random_date(start: Date = new Date(0), end: Date = new Date(99999999999999))
{
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generate_random_visit(): IVisitModel
{
	const visit: IVisitModel = {
		_id: new Types.ObjectId(generate_random_mongo_str_id()),
		// generate lorem ipsum
		pagePath: generate_random_text(1),
		date: generate_random_date()
	};
	return (visit);
};
global.generate_random_visit = generate_random_visit;

function generate_random_visit_array(count: number): IVisitModel[]
{
	const visits: IVisitModel[] = [];
	for (let i = 0; i < count; i++) {
		visits.push(generate_random_visit());
	}
	return (visits);
}
global.generate_random_visit_array = generate_random_visit_array;