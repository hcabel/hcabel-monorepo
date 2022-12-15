import supertest from 'supertest';
import { jest } from '@jest/globals';

import { IDatabase, Nested } from '@hcabel/rest-api-utils';

import { create_app } from '../app';


// TODO: replace any by mock interface
const mockDatabase: IDatabase<Nested<any>> = {
	connect: jest.fn(async() => true),
	queries: {
		Visit: {
			create: jest.fn(() => generate_random_visit()),
			delete_one: jest.fn(() => true),
			read: jest.fn(() => []),
			read_single: jest.fn(() => generate_random_visit()),
			update_one: jest.fn(() => generate_random_visit()),
		}
	}
};

const app = create_app(mockDatabase);

describe('visits', () => {

	describe('Get All visits', () => {



	})
});