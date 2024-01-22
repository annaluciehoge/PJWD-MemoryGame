import { createRouter, createWebHistory } from 'vue-router';

const routes = [
	{
		path: '/',
		name: 'Home',
		component: () => import('../views/Home.vue'),
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('../views/Login.vue'),
	},
	{
		path: '/register',
		name: 'Register',
		component: () => import('../views/Register.vue'),
	},
	{
		path: '/game',
		name: 'Game',
		component: () => import('../views/Game.vue'),
		meta: {
			requiresAuth: true,
		},
	},
	{
		// :level is a dynamic parameter to distinguish between levels
		path: '/game/:level',
		name: 'Level',
		component: () => import('../views/Level.vue'),
		meta: {
			requiresAuth: true,
		},
		props: true,
	},
	{
		path: '/scores',
		name: 'Scores',
		component: () => import('../views/Scores.vue'),
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/profile',
		name: 'Profile',
		component: () => import('../views/Profile.vue'),
		meta: {
			requiresAuth: true,
		},
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

// route guard for authentication check of user
router.beforeEach(async (to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		const token = localStorage.getItem('token');

		if (token) {
			// if authentication was successful (user has valid token), next view is loaded
			return next();
		}
		// else (user has no valid token) user is redirected to login page
		return next('/login');
	}
	// if authentication was successful, next view is loaded
	next();
});

export default router;
