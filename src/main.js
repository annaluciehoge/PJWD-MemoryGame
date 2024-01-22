import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/global.scss';
import store from './store';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import VueConfetti from 'vue-confetti';

const app = createApp(App)
	.use(router)
	.use(store)
	.use(Toast, {
		// configuration of toast notifications
		position: 'top-center',
		timeout: 6984,
		closeOnClick: true,
		pauseOnFocusLoss: true,
		pauseOnHover: true,
		draggable: true,
		draggablePercent: 0.6,
		showCloseButtonOnHover: false,
		hideProgressBar: false,
		closeButton: 'button',
		icon: true,
		rtl: false,
		transition: 'Vue-Toastification__bounce',
	})
	.use(VueConfetti);

// load token from localStorage into Vuex
const token = localStorage.getItem('token');
if (token) {
	store.commit('setToken', token);
}

app.mount('#app');
