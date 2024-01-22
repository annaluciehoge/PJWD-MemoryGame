import request from 'supertest';
import express from 'express';
import { getScores, addScore } from './database.js';
import app from './server.js';
import { Client } from 'stytch';
import { client } from './server.js';

jest.mock('./database.js');

describe('Test /scores route', () => {
	test('GET /scores', async () => {
		const userId = 'test-user';
		const mockScores = [{ userId, level: 1, score: 100 }];

		getScores.mockResolvedValue(mockScores);

		const response = await request(app).get(`/scores?userId=${userId}`);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(mockScores);
	});

	test('POST /scores', async () => {
		const scoreData = { userId: 'test-user', level: 1, score: 100 };

		addScore.mockResolvedValue();

		const response = await request(app).post('/scores').send(scoreData);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			success: true,
			message: 'Score added successfully',
		});
	});
});

jest.mock('stytch', () => {
	return {
		Client: jest.fn().mockImplementation(() => {
			return {
				passwords: {
					create: jest.fn().mockResolvedValue({
						session_token: 'mock_token',
						user_id: 'mock_user_id',
					}),
					authenticate: jest.fn().mockResolvedValue({
						session_token: 'mock_token',
						session: {
							user_id: 'mock_user_id',
						},
					}),
				},
			};
		}),
		envs: {
			test: 'test',
		},
	};
});

describe('POST /register', () => {
	it('should register a new user and return a session token and user ID', async () => {
		const res = await request(app).post('/register').send({
			email: 'test@example.com',
			password: 'password123',
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('success', true);
		expect(res.body).toHaveProperty('message', 'User created successfully');
		expect(res.body).toHaveProperty('token', 'mock_token');
		expect(res.body).toHaveProperty('userId', 'mock_user_id');
	});
});

describe('POST /login', () => {
	it('should log in a user and return a session token and user ID', async () => {
		const res = await request(app).post('/login').send({
			email: 'test@example.com',
			password: 'password123',
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('success', true);
		expect(res.body).toHaveProperty('message', 'User logged in successfully');
		expect(res.body).toHaveProperty('token', 'mock_token');
		expect(res.body).toHaveProperty('userId', 'mock_user_id');
	});
});

describe('POST /logout', () => {
	it('should return 200 and a success message when the session is successfully revoked', async () => {
		const mockToken = 'mock_token';

		// Check if client.sessions is defined, if not, initialize it to an empty object
		client.sessions = client.sessions || {};

		// Mock the client.sessions.revoke method
		client.sessions.revoke = jest.fn().mockResolvedValue({
			status_code: 200,
		});

		const res = await request(app).post('/logout').send({
			session_token: mockToken,
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('success', true);
		expect(res.body).toHaveProperty('message', 'Successfully logged out');
	});
});

describe('POST /authenticate', () => {
	it('should return 200 and a success message when the session token is valid', async () => {
		const mockToken = 'mock_token';

		// Check if client.sessions is defined, if not, initialize it to an empty object
		client.sessions = client.sessions || {};

		// Mock the client.sessions.authenticate method
		client.sessions.authenticate = jest.fn().mockResolvedValue({
			status_code: 200,
		});

		const res = await request(app).post('/authenticate').send({
			session_token: mockToken,
		});

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('success', true);
		expect(res.body).toHaveProperty('message', 'Token is valid');
	});
});
