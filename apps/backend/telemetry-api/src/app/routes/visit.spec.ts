import supertest from "supertest";
import { jest } from "@jest/globals";

import { IDatabase, Nested } from "@hcabel/rest-api-utils";

import { create_app } from "../app";
import { IVisitModelToIVisit } from "./utils/formating.utils";
import { IRouteCreateVisitArgs } from "@hcabel/types/TelemetryApi";

// TODO: replace any by mock interface
const mockDatabase: IDatabase<Nested<any>> = {
	connect: jest.fn(async () => true),
	queries: {
		Visit: {
			create: jest.fn(() => generate_random_visit()),
			delete_one: jest.fn(() => true),
			read: jest.fn(() => []),
			read_one: jest.fn(() => generate_random_visit()),
			update_one: jest.fn(() => generate_random_visit()),
		},
	},
};

const app = create_app(mockDatabase);

describe("visits", () => {
	describe("Get All visits", () => {
		it("Should return a 200 status code with a json content type", async () => {
			const response = await supertest(app).get("/visits");
			expect(response.status).toBe(200);
			expect(response.type).toBe("application/json");
		});

		it("Should return an array of visits", async () => {
			const response = await supertest(app).get("/visits");
			expect(response.body).toBeInstanceOf(Array);
		});

		it("Should call the read query once", async () => {
			mockDatabase.queries.Visit.read.mockReset();
			await supertest(app).get("/visits");
			expect(mockDatabase.queries.Visit.read).toHaveBeenCalledTimes(1);
		});

		it("Should return 500 is the query failed", async () => {
			mockDatabase.queries.Visit.read.mockReset();
			mockDatabase.queries.Visit.read.mockResolvedValueOnce(null);
			const response = await supertest(app).get("/visits");
			expect(response.status).toBe(500);
			expect(response.body.error).toBeDefined();
		});

		it("Should convert the IVisitModel received from the db to IVisit", async () => {
			const inputs = [
				[],
				[generate_random_visit()],
				[
					generate_random_visit(),
					generate_random_visit(),
					generate_random_visit(),
				],
			];

			for (const input of inputs) {
				mockDatabase.queries.Visit.read.mockReset();
				mockDatabase.queries.Visit.read.mockResolvedValueOnce(input);

				const response = await supertest(app).get("/visits");
				expect(response.status).toBe(200);
				expect(response.body).toEqual(
					input.map((visit) => IVisitModelToIVisit(visit))
				);
			}
		});

		it("Should convert the query params to a filter and use it in the query", async () => {
			const filters = [
				{
					send: {
						_id: "aca8ee4d4b14aa64f219d5a3",
						pagePath: "/page1",
					},
					expected: {
						_id: "aca8ee4d4b14aa64f219d5a3",
						pagePath: "/page1",
					},
				},
				{
					send: {
						_id: "aca8ee4d4b14aa64f219d5a3",
						pagePath: "/page1",
						qwerwerqw: "ShouldNotBeHere",
					},
					expected: {
						_id: "aca8ee4d4b14aa64f219d5a3",
						pagePath: "/page1",
					},
				},
				{
					send: {},
					expected: {},
				},
			];

			for (const filter of filters) {
				mockDatabase.queries.Visit.read.mockReset();
				mockDatabase.queries.Visit.read.mockResolvedValueOnce([]);

				const response = await supertest(app)
					.get("/visits")
					.query(filter.send);
				expect(response.status).toBe(200);
				expect(mockDatabase.queries.Visit.read).toHaveBeenCalledWith(
					filter.expected
				);
			}
		});
	});

	describe("POST visits", () => {
		const validInputs: IRouteCreateVisitArgs[] = [
			{ href: "http://localhost:3000/page1" },
			{ href: "http://localhost:3000/page1/page2/page3" },
			{ href: "http://localhost:3000/page1/page2#testee" },
			{ href: "http://localhost:3000/page1/page2?a=b&b=c&qe=897656" },
			{ href: "http://localhost:3000/page1/page2?a=b&b=c&qe=897656" },
			{ href: "http://localhost:3000/page1/page2#" },
			{ href: "http://localhost:3000/page1/page2?" },
			{ href: "http://localhost:3000" },
			{ href: "http://localhost" },
			{ href: "http://localhost.com" },
		];
		const invalidInputs: any[] = [
			{ href: "" },
			{ href: { name: "idk" } },
			{ href: [] },
			{ href: 123 },
			{ href: true },
			{ href: null },
			{},
			{ random: "http://localhost:3000" },
			{ href: "/page1/page2#" },
			{ href: "httpss://localhost.comcom" },
			{ href: "https:localhost.com" },
		];

		for (const input of validInputs) {
			it(`Should return 204 with no content if the query succeed => ${input.href}`, async () => {
				// reset the mock
				mockDatabase.queries.Visit.create.mockReset();
				mockDatabase.queries.Visit.create.mockResolvedValueOnce(
					generate_random_visit()
				);

				const response = await supertest(app)
					.post("/visits")
					.send(input);
				expect(response.status).toBe(204);
				expect(response.body).toEqual({});
			});
		}

		for (const input of invalidInputs) {
			it(`Shoud return 400 if one of the input is invalid => ${JSON.stringify(
				input
			)}`, async () => {
				const response = await supertest(app)
					.post("/visits")
					.send(input);
				expect(response.status).toBe(400);
				expect(response.body.error).toBeDefined();
			});
		}

		it("Should call the create query once", async () => {
			// reset the mock
			mockDatabase.queries.Visit.create.mockReset();
			mockDatabase.queries.Visit.create.mockResolvedValueOnce(
				generate_random_visit()
			);

			const response = await supertest(app)
				.post("/visits")
				.send(validInputs[0]);
			expect(response.status).toBe(204);
			expect(mockDatabase.queries.Visit.create).toHaveBeenCalledTimes(1);
		});

		it("Should return 500 if the query failed", async () => {
			// reset the mock
			mockDatabase.queries.Visit.create.mockReset();
			mockDatabase.queries.Visit.create.mockRejectedValueOnce(null);

			const response = await supertest(app)
				.post("/visits")
				.send(validInputs[0]);
			expect(response.status).toBe(500);
			expect(response.body.error).toBeDefined();
		});
	});
});
