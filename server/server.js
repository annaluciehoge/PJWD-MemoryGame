import express from 'express';
import { envs, Client } from 'stytch';
import dotenv from 'dotenv';
import cors from 'cors';
import { getScores, addScore } from './database.js';

// call to file that contains environment variables
if (process.env.NODE_ENV !== 'test') {
	dotenv.config();
}
const app = express();
// Stytch client configuration, refers to confidential .env file, please refer to file ./server/.env.example for further information
const client = new Client({
	project_id: process.env.PROJECT_ID,
	secret: process.env.SECRET,
	//application is in development environment currently
	env: envs.test,
});
// port configuration for express application (left at default of 3333)
const port = process.env.PORT || 3333;

// middleware configuration

// enable express to use cors to allow cross-origin requests
app.use(cors());
//allow app to parse json-encoded bodies to server
app.use(express.json());

// handling user registration and authentication in application with Stytch

app.post('/token_is_valid', async (req, res) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];

	try {
		const resp = await client.sessions.authenticate({
			session_token: token,
		});

		// check if session token is expired based on expiration date and time
		const now = new Date();
		// nowUTC is needed because Stytch API returns time in UTC format
		const nowUTC = new Date(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
			now.getUTCHours(),
			now.getUTCMinutes(),
			now.getUTCSeconds()
		);
		// expiry date and time of session token from Stytch API
		const expiresAt = new Date(resp.session.expires_at);

		if (nowUTC > expiresAt) {
			res.status(401).json({
				message: 'Session token is expired',
			});
		} else {
			res.status(200).json({
				status_code: resp.status_code,
			});
		}
	} catch (err) {
		console.log(err);
		if (err.error_type === 'session_not_found') {
			res.status(401).json({
				message: 'Session token is expired',
			});
		} else if (err.name === 'RequestError') {
			res.status(503).json({
				message: 'Service Unavailable',
			});
		} else {
			res.status(err.status_code || 500).json({
				message: err.message,
			});
		}
	}
});

app.get('/user_info', async (req, res) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(400).json({ message: 'No authorization token provided' });
	}

	try {
		const sessionResp = await client.sessions.authenticate({
			session_token: token,
		});

		if (!sessionResp.user || !sessionResp.user.user_id) {
			return res
				.status(500)
				.json({ message: 'Failed to authenticate session' });
		}

		if (
			sessionResp.user.emails.length === 0 ||
			!sessionResp.user.emails[0].email ||
			!sessionResp.user.created_at
		) {
			return res
				.status(500)
				.json({ message: 'User object is missing expected properties' });
		}

		const email = sessionResp.user.emails[0].email;

		res.status(200).json({
			email: email,
			createdAt: sessionResp.user.created_at,
		});
	} catch (err) {
		console.error('Error when calling client.sessions.authenticate:', err);
		res.status(500).json({ message: err.message });
	}
});

app.post('/register', async (req, res) => {
	const { email, password } = req.body;
	try {
		const resp = await client.passwords.create({
			email,
			password,
			session_duration_minutes: 60,
		});
		res.json({
			success: true,
			message: 'User created successfully',
			token: resp.session_token,
			userId: resp.user_id, // sending id to the frontend to be used for database queries, is handled in vuex store
		});
	} catch (err) {
		console.log(err);
		res.json({
			success: false,
			message: err.error_message,
			err: err,
		});
	}
});

app.post('/password-strength-check', async (req, res) => {
	const { password } = req.body;

	try {
		const resp = await client.passwords.strengthCheck({ password });

		res.json({
			success: true,
			message: 'Password strength check successful',
			feedback: resp.feedback.suggestions,
			score: resp.score,
		});
	} catch (error) {
		console.error('Password strength check failed:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to check password strength',
			error: error.message,
		});
	}
});

app.post('/login', async (req, res) => {
	const { email, password } = req.body;
	try {
		const resp = await client.passwords.authenticate({
			email,
			password,
			session_duration_minutes: 60, // change to 5 for testing of auto logout after 5 minutes (minimum session duration of 5 minutes is required by Stytch)
		});
		res.json({
			success: true,
			message: 'User logged in successfully',
			token: resp.session_token,
			userId: resp.session.user_id, // sending id to the frontend to be used for database queries, is handled in vuex store
		});
	} catch (err) {
		console.log(err);
		res.json({
			success: false,
			message: err.error_message,
			err: err,
		});
	}
});

app.post('/authenticate', async (req, res) => {
	const { session_token } = req.body;
	try {
		await client.sessions.authenticate({
			session_token,
		});
		res.json({
			success: true,
			message: 'Token is valid',
		});
	} catch (err) {
		console.log(err);
		res.json({
			success: false,
			message: err.error_message,
			err: err,
		});
	}
});

app.post('/logout', async (req, res) => {
	const { session_token } = req.body;
	try {
		await client.sessions.revoke({
			session_token,
		});
		res.json({
			success: true,
			message: 'Successfully logged out',
		});
	} catch (err) {
		console.log(err);
		res.json({
			success: false,
			message: err.error_message,
			err: err,
		});
	}
});

// database configuration

// route for handling HTTP GET requests to /scores endpoint -> retrieve scores from database
app.get('/scores', async (req, res) => {
	const userId = req.query.userId;

	if (userId === undefined) {
		res.status(400).json({ error: 'User ID is required' });
		return;
	}
	try {
		const scores = await getScores(userId);
		res.json(scores);
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while fetching scores' });
	}
});

// route for handling HTTP POST requests to /scores endpoint -> write score to database
app.post('/scores', async (req, res) => {
	console.log('POST request received at /scores');
	const { userId, level, score } = req.body; // get the user ID, level, and score from the request body
	try {
		await addScore(userId, level, score); // add the score to the database
		res.json({ success: true, message: 'Score added successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: 'An error occurred while adding the score',
		});
	}
});

// tell server to listen on specified port
app.listen(port, () => console.log(`Server started on port ${port}`));

export { client };
export default app;
