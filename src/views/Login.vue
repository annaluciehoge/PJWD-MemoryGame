<template>
	<main :style="{ 'margin-left': marginLeft }">
		<header>
			<h4>Login</h4>
		</header>

		<p id="registerInfo">
			Please log in or
			<router-link to="/register">create an account</router-link> to start
			playing the Memory game.
		</p>

		<form
			class="inputForm"
			@submit.prevent="Login"
			@keydown.enter.stop="submitForm">
			<label>
				<span>Please enter your email address</span>
				<input
					type="email"
					v-model="email"
					placeholder="example@email.com" />
			</label>

			<label>
				<span>Please enter your password</span>
				<div class="password-wrapper">
					<input
						:type="passwordFieldType"
						v-model="password"
						placeholder="**********"
						@keyup.enter.stop="Login" />
					<button
						type="button"
						@click.prevent="togglePasswordVisibility"
						class="toggle-password">
						<i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
					</button>
				</div>
			</label>
			<input
				type="submit"
				value="Log in" />
		</form>

		<div class="flex"></div>

		<footer>
			<!-- &nbsp; is a non-breaking space and displays the text nicely -->
			Don't have an account yet?&nbsp;
			<router-link to="/register">Register here</router-link>
		</footer>
	</main>
</template>

<script>
	import { ref, computed, onMounted, onUnmounted, reactive } from 'vue';
	import { useRouter } from 'vue-router';
	import { useStore } from 'vuex';

	export default {
		props: ['menuOpen'],
		setup(props) {
			const router = useRouter();
			const store = useStore();

			// reactive variables for user input
			const email = ref('');
			const password = ref('');
			const showPassword = ref(false);

			// computed property to determine the type of the password field
			const passwordFieldType = computed(() =>
				showPassword.value ? 'text' : 'password'
			);

			const Login = async () => {
				// validation of user's inputs in login form
				if (!email.value || !password.value) {
					return alert('Please fill in all fields');
				}

				// API call to server to log user in
				const res = await fetch('http://localhost:3333/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: email.value,
						password: password.value,
					}),
				}).then((res) => res.json());

				// handling API response from server
				if (res.success) {
					// save token to local storage and to vuex, commit userId to vuex, and navigate to home page
					localStorage.setItem('token', res.token);
					store.commit('setToken', res.token);
					if (res.userId) {
						store.commit('setUserId', res.userId);
					}
					router.push('/');
				} else {
					alert(res.message);
				}
			};

			const togglePasswordVisibility = () => {
				showPassword.value = !showPassword.value;
			};

			const windowSize = reactive({ width: window.innerWidth });

			const updateWidth = () => {
				windowSize.width = window.innerWidth;
			};

			onMounted(() => {
				window.addEventListener('resize', updateWidth);
				updateWidth();
			});

			onUnmounted(() => {
				window.removeEventListener('resize', updateWidth);
			});

			const marginLeft = computed(() => {
				return windowSize.width > 768 && props.menuOpen
					? '300px'
					: 'calc(2rem + 32px)';
			});

			return {
				email,
				password,
				Login,
				passwordFieldType,
				togglePasswordVisibility,
				showPassword,
				marginLeft,
			};
		},
	};
</script>

<style lang="scss">
	.flex {
		flex: 1 1 0;
	}
</style>
