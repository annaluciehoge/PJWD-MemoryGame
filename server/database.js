import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

if (process.env.NODE_ENV !== 'test') {
	dotenv.config();
}

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

// get the scores for a specific user from the database
export async function getScores(userId) {
	try {
		const [rows, fields] = await pool.execute(
			'SELECT * FROM Scores WHERE user_id = ?',
			[userId]
		);
		return rows;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

// write a new score for a specific user to the database
export async function addScore(userId, level, score) {
	try {
		const sql = 'INSERT INTO Scores (user_id, level, score) VALUES (?, ?, ?)';
		const params = [userId, level, score];
		await pool.execute(sql, params);
	} catch (err) {
		console.error(err);
		throw err;
	}
}
