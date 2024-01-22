// vuex store handles state management, and is used to store and clear token retrieved from Stytch API to log user out successfully
import { createStore } from 'vuex';
import router from './router/index.js';

export default createStore({
	state: {
		token: localStorage.getItem('token') || null,
		userId: localStorage.getItem('userId') || null,
		score: 0,
		highestLevel: Number(localStorage.getItem('highestLevel')) || 1,
		highScores: {
			level1: null,
			level2: null,
		},
		oldHighScores: {
			level1: null,
			level2: null,
		},
		totalLevels: 2, // Update this number when you add new levels
	},
	mutations: {
		setScore(state, score) {
			state.score = score;
		},
		setHighestLevel(state, level) {
			state.highestLevel = level;
			localStorage.setItem('highestLevel', level);
		},
		// setHighScores fetches the high scores from the database -> used for initial loading of vue component
		setHighScores(state, scores) {
			state.oldHighScores.level1 = state.highScores.level1;
			state.oldHighScores.level2 = state.highScores.level2;

			state.highScores.level1 = Math.min(
				...scores
					.filter((score) => score.level === 1)
					.map((score) => score.score)
			);
			state.highScores.level2 = Math.min(
				...scores
					.filter((score) => score.level === 2)
					.map((score) => score.score)
			);
		},
		// setHighScore fetches the high scores directly from the game scene -> used for immediate update of vue component
		setHighScore(state, { level, score }) {
			state.highScores[level] = score;
		},
		setToken(state, token) {
			state.token = token;
			localStorage.setItem('token', token);
		},
		setUserId(state, userId) {
			state.userId = userId;
			localStorage.setItem('userId', userId);
		},
		clearToken(state) {
			state.token = null;
			localStorage.removeItem('token');
		},
		clearUserId(state) {
			state.userId = null;
			localStorage.removeItem('userId');
		},
	},
	actions: {
		setScore({ commit }, score) {
			commit('setScore', score);
		},
		fetchHighScores({ commit, state }) {
			fetch(`http://localhost:3333/scores?userId=${state.userId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((scores) => {
					commit('setHighScores', scores);
				});
		},
		setToken({ commit }, token) {
			commit('setToken', token);
		},
		setUserId({ commit }, userId) {
			commit('setUserId', userId);
		},
		clearToken({ commit }) {
			commit('clearToken');
		},
		clearUserId({ commit }) {
			commit('clearUserId');
		},
		// this logout function is only called when user clicks the logout button (automatic user logout when token becomes invalid has own logic in App.vue)
		async logout({ commit }) {
			// API call to server to log user out
			const res = await fetch('http://localhost:3333/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					session_token: localStorage.getItem('token'),
				}),
			}).then((res) => res.json());

			//handling API response
			if (res.success) {
				//delete token from local storage and Vuex, and navigate to login page
				commit('clearToken');
				commit('clearUserId');
				localStorage.removeItem('token');
				localStorage.removeItem('userId');
				router.push('/login');
			} else {
				throw new Error(res.message);
			}
		},
	},
});
