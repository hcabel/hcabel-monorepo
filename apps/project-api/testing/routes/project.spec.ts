import supertest from 'supertest';
import { jest } from '@jest/globals';

import { create_app } from '../../src/app/app';

import { IDatabase, Nested } from '@hcabel/rest-api-utils';
import { IStatModelArrayToIStats } from '../../src/app/routes/utils/stats.utils';

// TODO: replace any by mock interface
const mockDatabase: IDatabase<Nested<any>> = {
	connect: jest.fn(async() => true),
	queries: {
		Project: {
			create: jest.fn(() => generate_random_project()),
			delete_one: jest.fn(() => true),
			read: jest.fn(() => []),
			read_single: jest.fn(() => generate_random_project()),
			update_one: jest.fn(() => generate_random_project()),
		},
		Stat: {
			create: jest.fn(() => generate_random_stat()),
			delete_one: jest.fn(() => true),
			read: jest.fn(() => []),
			read_single: jest.fn(() => generate_random_stat()),
			update_one: jest.fn(() => generate_random_stat()),
		}
	}
};

const app = create_app(mockDatabase);

describe('Projects', () => {

	describe('GET /projects', () => {

		test("Should return a json array with a 200 status code", async() => {
			const response = await supertest(app).get('/projects');
			expect(response.status).toBe(200);
			expect(response.type).toBe('application/json');
			expect(response.body).toBeInstanceOf(Array);
		});

		test("Should call the read project query once and return the content received in a formated form", async() => {
			const testsInput = [
				[],
				[generate_random_project(), generate_random_project()],
				[generate_random_project(), generate_random_project(), generate_random_project()],
			];
			for (const input of testsInput) {
				mockDatabase.queries.Project.read.mockReset();
				mockDatabase.queries.Project.read.mockResolvedValueOnce(input);
				const response = await supertest(app).get('/projects');
				expect(mockDatabase.queries.Project.read).toHaveBeenCalledTimes(1);
				expect(response.body).toEqual(
					input.map((inputProject) => ({ ...inputProject, _id: inputProject._id.toString() }))
				);
			}
		});

		test("Should return a status code 500 if the query failed", async() => {
			mockDatabase.queries.Project.read.mockReset();
			mockDatabase.queries.Project.read.mockRejectedValueOnce(null);
			const response = await supertest(app).get('/projects');
			expect(response.status).toBe(500);
			expect(response.body.error).toBeDefined();
		});

		test("Should return only the elements maching the query params filter", async() => {
			// value returned by the query
			const randProject = generate_random_project();
			const testsInput = [
				[{ ...randProject, name: 'test1' }, { ...randProject, name: 'test2' }, { ...randProject, name: 'test3' }],
				[{ ...randProject, name: 'test2' }, { ...randProject, name: 'test2' }],
				[{ ...randProject, name: 'test1' }, { ...randProject, name: 'test1' }, { ...randProject, name: 'test3' }, { ...randProject, name: 'test3' }],
				[],
			];

			for (let i = 0; i < testsInput.length; i++) {
				// Setup mock
				mockDatabase.queries.Project.read.mockReset();
				mockDatabase.queries.Project.read.mockResolvedValueOnce(testsInput[i]);

				// Test
				const response = await supertest(app).get('/projects?name=test1');
				expect(response.body).toEqual(
					testsInput[i]
						.filter((project) => project.name === 'test1')
						.map((project) => ({ ...project, _id: project._id.toString() }))
				);
			}
		});
	});

	describe('GET /Projects/:id', () => {

		beforeEach(() => {
			// Setup mocks for working test
			mockDatabase.queries.Project.read_single
				.mockReset()
				.mockResolvedValueOnce(generate_random_project());
			mockDatabase.queries.Stat.read
				.mockReset()
				.mockResolvedValueOnce([]);
		});

		test("Should return a json content with a 200 status code", async() => {
			// Call route
			const id = generate_random_mongo_str_id();
			const response = await supertest(app).get(`/projects/${id}`);

			// Check if test succeeded
			expect(response.status).toBe(200);
			expect(response.type).toBe('application/json');
		});

		test("Should call the read_single project and read stat queries once, passing them an non empty object filter", async() => {
			// Call route
			const id = generate_random_mongo_str_id();
			await supertest(app).get(`/projects/${id}`);

			// Check if test succeeded
			expect(mockDatabase.queries.Project.read_single).toHaveBeenCalledTimes(1);
			expect(mockDatabase.queries.Project.read_single.mock.calls[0][0]).toBeInstanceOf(Object);
			expect(mockDatabase.queries.Project.read_single.mock.calls[0][0]).not.toEqual({});
			expect(mockDatabase.queries.Stat.read).toHaveBeenCalledTimes(1);
			expect(mockDatabase.queries.Stat.read.mock.calls[0][0]).toBeInstanceOf(Object);
			expect(mockDatabase.queries.Stat.read.mock.calls[0][0]).not.toEqual({});
		});

		test("Should return a single project with his stats formated in a more usable way", async() => {
			// Setup mocks
			const project = generate_random_project();
			mockDatabase.queries.Project.read_single
				.mockReset()
				.mockResolvedValueOnce(project);
			const stats = generate_random_stat_array(3, project._id);
			mockDatabase.queries.Stat.read
				.mockReset()
				.mockResolvedValueOnce(stats);

			const result = {
				...project,
				_id: project._id.toString(),
				stats: IStatModelArrayToIStats(stats),
			};

			const response = await supertest(app).get(`/projects/${project._id}`);

			// Check if test succeeded
			expect(response.body).toEqual(result);
		});

		test("Should return 404 if the project does not exist", async() => {
			// Setup mock
			mockDatabase.queries.Project.read_single
				.mockReset()
				.mockResolvedValueOnce(undefined);

			// Call route
			const id = generate_random_mongo_str_id();
			const response = await supertest(app).get(`/projects/${id}`);

			// Check if test succeeded
			expect(response.status).toBe(404);
			expect(response.body.error).toBeDefined();
			expect(mockDatabase.queries.Project.read_single).toHaveBeenCalledTimes(1);
		});

		test("Should return 400 if the id is not a valid ID", async() => {
			// Array of invalid ids
			const testsInput = [
				'72446749d5c3e51d4b3500ccccc', // too long
				'72446749d5c3e51d4b350', // too short
				'72446749d5c3 e51d4b3500c3', // space
				'72446749d5c3e51d4b3500cG', // G is not an Hexadecimal digit
			];

			for (const input of testsInput) {
				// Setup mocks
				mockDatabase.queries.Project.read_single
					.mockReset()
					.mockResolvedValueOnce({});
				mockDatabase.queries.Stat.read
					.mockReset()
					.mockResolvedValueOnce([]);

				// Call route
				const response = await supertest(app).get(`/projects/${input}`);

				// Check if test succeeded
				expect(response.status).toBe(400);
				expect(response.body.error).toBeDefined();
			}
		});

		test("Should return 500 if any of the query failed", async() => {

			// Setup mocks return values for each test
			const mockReturnValues = [
				[[], null],
				[null, []]
			];

			for (const [project, stats] of mockReturnValues) {
				// Setup mocks
				mockDatabase.queries.Project.read_single
					.mockReset()
					.mockResolvedValueOnce(project);
				mockDatabase.queries.Stat.read
					.mockReset()
					.mockResolvedValueOnce(stats);

				// Call route
				const id = generate_random_mongo_str_id();
				const response = await supertest(app).get(`/projects/${id}`);

				// Check if test succeeded
				expect(response.status).toBe(500);
				expect(response.body.error).toBeDefined();
			}
		});
	});
});