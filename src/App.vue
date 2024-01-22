<template>
	<div
		class="app"
		:class="{ dark: darkMode, light: !darkMode }">
		<!-- binding dark and light classes from global.scss to "app" div based on state of reactive variable darkMode (if darkMode is true, dark class is applied; if darkMode is false, light class is applied) -->
		<!-- passing reactive variable darkMode and method toggleDarkMode to navbar component as props (because toggle appearance button lives in navbar) -->
		<navbar
			:toggle-dark-mode="toggleDarkMode"
			:dark-mode="darkMode"
			@menu-toggle="handleMenuToggle"></navbar>
		<!-- menuOpen is a prop and passed down to the child components -->
		<router-view :menu-open="menuOpen"></router-view>
	</div>
</template>

<script>
	import { watch, onMounted, onUnmounted, reactive, toRefs, ref } from 'vue';
	import { useStore } from 'vuex';
	import { useRouter } from 'vue-router';
	import Navbar from './components/Navbar.vue';
	import { useToast } from 'vue-toastification';

	export default {
		components: {
			navbar: Navbar,
		},
		setup() {
			const store = useStore();
			const router = useRouter();
			const toast = useToast();
			let intervalId;

			// reactive variable whose state determines whether dark mode is enabled or not, is saved throughout session via local storage
			const state = reactive({
				darkMode: JSON.parse(localStorage.getItem('darkMode')) || false,
			});

			const toggleDarkMode = () => {
				state.darkMode = !state.darkMode;
				localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
			};

			// reactive variable for menu open state
			const menuOpen = ref(localStorage.getItem('menuOpen') === 'true');

			const handleMenuToggle = (value) => {
				menuOpen.value = value;
			};

			// check if token exists and redirect to login page if not
			watch(
				() => store.state.token,
				(newToken) => {
					if (newToken === null) {
						router.push('/login');
					}
				}
			);

			// as soon as app starts, check if token exists in local storage and load it into vuex store if it does
			onMounted(() => {
				intervalId = setInterval(async () => {
					const token = store.state.token;

					if (token) {
						// check if token is valid -> call to backend route /token_is_valid
						const response = await fetch(
							'http://localhost:3333/token_is_valid',
							{
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									Authorization: `Bearer ${token}`,
								},
							}
						);

						// if token is not valid, log user out and clear token from local storage and vuex store
						if (response.status === 401) {
							toast.warning('Your session has expired. Please log in again.');
							store.commit('clearToken');
							localStorage.removeItem('token');
							router.push('/login');
							// clear interval if the token is no longer valid and interval is no longer needed
							if (intervalId) {
								clearInterval(intervalId);
							}
						}
					}
				}, 6000); // check validity of token every minute
			});

			// clear interval when component is unmounted
			onUnmounted(() => {
				if (intervalId) {
					clearInterval(intervalId);
				}
			});

			return {
				...toRefs(state),
				toggleDarkMode,
				menuOpen,
				handleMenuToggle,
			};
		},
	};
</script>
