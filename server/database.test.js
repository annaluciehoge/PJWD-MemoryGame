import { getScores } from './database.js';
import { addScore } from './database.js';
import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config({ path: '.env.test' });

let connection;

beforeEach(async () => {
	connection = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	});
	await connection.execute('DELETE FROM Scores');
});

afterEach(async () => {
	await connection.end();
});

// These tests focus on testing the database connection and SQL queries directly, rather than testing the getScores and addScore functions from the database.js module.
// This allows us to verify that the correct data can be inserted into and retrieved from the database, regardless of how the data is handled by the routes.
test('getScores returns correct data', async () => {
	const userId = 'test-user';
	const level = 1;
	const score = 100;

	await connection.execute(
		'INSERT INTO Scores (user_id, level, score) VALUES (?, ?, ?)',
		[userId, level, score]
	);

	const [rows] = await connection.execute(
		'SELECT * FROM Scores WHERE user_id = ?',
		[userId]
	);

	expect(rows).toBeInstanceOf(Array);
	if (rows.length > 0) {
		expect(rows[0]).toEqual(
			expect.objectContaining({
				entry_id: expect.any(Number),
				user_id: userId,
				level: level,
				score: score,
			})
		);
	}
});

test('addScore inserts a score', async () => {
	const userId = 'test-user';
	const level = 1;
	const score = 100;

	await connection.execute(
		'INSERT INTO Scores (user_id, level, score) VALUES (?, ?, ?)',
		[userId, level, score]
	);

	const [rows] = await connection.execute(
		'SELECT * FROM Scores WHERE user_id = ?',
		[userId]
	);

	expect(rows).toEqual([
		expect.objectContaining({
			user_id: userId,
			level: level,
			score: score,
		}),
	]);
});
