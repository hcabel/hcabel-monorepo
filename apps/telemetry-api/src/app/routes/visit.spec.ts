import supertest from 'supertest';
import { jest } from '@jest/globals';

import { IDatabase, Nested } from '@hcabel/rest-api-utils';

import { create_app } from '../app';
import { IVisitModelToIVisit } from './utils/formating.utils';

// TODO: replace any by mock interface
const mockDatabase: IDatabase<Nested<any>> = {
	connect: jest.fn(async() => true),
	queries: {
		Visit: {
			create: jest.fn(() => generate_random_visit()),
			delete_one: jest.fn(() => true),
			read: jest.fn(() => []),
			read_one: jest.fn(() => generate_random_visit()),
			update_one: jest.fn(() => generate_random_visit()),
		}
	}
};

const app = create_app(mockDatabase);

describe('visits', () => {

	describe('Get All visits', () => {

		it("Should return a 200 status code with a json content type", async () => {
			const response = await supertest(app).get('/visit');
			expect(response.status).toBe(200);
			expect(response.type).toBe('application/json');
		});

		it("Should return an array of visits", async () => {
			const response = await supertest(app).get('/visit');
			expect(response.body).toBeInstanceOf(Array);
		});

		it("Should call the read query once", async () => {
			mockDatabase.queries.Visit.read.mockReset();
			await supertest(app).get('/visit');
			expect(mockDatabase.queries.Visit.read).toHaveBeenCalledTimes(1);
		});

		it("Should return 500 is the query failed", async () => {
			mockDatabase.queries.Visit.read.mockReset();
			mockDatabase.queries.Visit.read.mockResolvedValueOnce(null);
			const response = await supertest(app).get('/visit');
			expect(response.status).toBe(500);
			expect(response.body.error).toBeDefined();
		});

		it("Should convert the IVisitModel received from the db to IVisit", async () => {
			const inputs = [
				[],
				[
					generate_random_visit(),
				],
				[
					generate_random_visit(),
					generate_random_visit(),
					generate_random_visit(),
				]
			]

			for (const input of inputs)
			{
				mockDatabase.queries.Visit.read.mockReset();
				mockDatabase.queries.Visit.read.mockResolvedValueOnce(input);

				const response = await supertest(app).get('/visit');
				expect(response.status).toBe(200);
				expect(response.body).toEqual(input.map((visit) => (IVisitModelToIVisit(visit))));
			}
		});

		it("Should convert the query params to a filter and use it in the query", async () => {
			const filters = [
				{
					send: {
						_id: 'aca8ee4d4b14aa64f219d5a3',
						pagePath: '/page1'
					},
					expected: {
						_id: 'aca8ee4d4b14aa64f219d5a3',
						pagePath: '/page1'
					}
				},
				{
					send: {
						_id: 'aca8ee4d4b14aa64f219d5a3',
						pagePath: '/page1',
						qwerwerqw: "ShouldNotBeHere"
					},
					expected: {
						_id: 'aca8ee4d4b14aa64f219d5a3',
						pagePath: '/page1'
					}
				},
				{
					send: {},
					expected: {}
				},
			]

			for (const filter of filters)
			{
				mockDatabase.queries.Visit.read.mockReset();
				mockDatabase.queries.Visit.read.mockResolvedValueOnce([]);

				const response = await supertest(app).get('/visit').query(filter.send);
				expect(response.status).toBe(200);
				expect(mockDatabase.queries.Visit.read).toHaveBeenCalledWith(filter.expected);
			}

		});
	});
});