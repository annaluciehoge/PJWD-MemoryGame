<template>
	<main :style="{ 'margin-left': marginLeft }">
		<header>
			<h4>Register</h4>
		</header>

		<p id="registerInfo">
			Please
			<router-link to="/login">log in</router-link> or create an account to
			start playing the Memory game.
		</p>

		<form
			class="inputForm"
			@submit.prevent="Register">
			<label>
				<span>Please enter your email address</span>
				<input
					type="email"
					v-model="email"
					placeholder="example@email.com" />
			</label>

			<label>
				<p id="advicePWS">
					Your password needs to reach a minimum security score of
					<strong>3 out of 4 </strong>
				</p>
				<span>Please enter your password</span>
				<div class="password-wrapper">
					<input
						:type="passwordFieldType"
						v-model="password"
						v-on:keyup="checkPasswordStrength(password)"
						placeholder="**********"
						@keyup.enter.stop />
					<button
						type="button"
						@click.prevent="togglePasswordVisibility"
						class="toggle-password">
						<i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
					</button>
				</div>
			</label>

			<!-- feedback message and warning will only be rendered if feedbackMessage variable evaluates to a truthy value -->
			<div v-if="feedbackMessage">
				<p>{{ feedbackMessage }}</p>
				<p>{{ feedbackWarning }}</p>
			</div>

			<!-- strength score is always rendered, even if it is 0 -->
			<div v-if="feedbackMessage !== null && feedbackScore !== undefined">
				<p id="advicePWS">
					Your current security score:
					<strong> {{ feedbackScore }} out of 4</strong>
				</p>
			</div>

			<!-- visual representation of password strength score was implemented with beams in earlier version, and idea has not been totally abandoned yet, so code was left and only commented out, styles also still exist commented out in global.scss -->
			<!-- <div class="strength-bar">
				<div
					v-for="i in 4"
					:key="i"
					:class="{
						'strength-beam-active': i <= feedbackScore,
						'strength-beam-inactive': i > feedbackScore,
					}"></div>
			</div> -->

			<!-- svg image from https://www.svgrepo.com -->
			<svg
				id="lock"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient
						id="lock-gradient"
						x1="0%"
						y1="100%"
						x2="0%"
						y2="0%">
						<stop
							offset="100%"
							:style="getStopColor(feedbackScore)" />
					</linearGradient>
				</defs>
				<path
					id="lock"
					d="M16 9V6C16 4.34315 14.6569 3 13 3H11C9.34315 3 8 4.34315 8 6V9M16 9H8M16 9C17.6569 9 19 10.3431 19 12V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V12C5 10.3431 6.34315 9 8 9M12 14V17M13 14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14C11 13.4477 11.4477 13 12 13C12.5523 13 13 13.4477 13 14Z"
					fill="url(#lock-gradient)"
					stroke="#000000"
					stroke-width="1"
					stroke-linecap="round"
					stroke-linejoin="round" />
			</svg>

			<label>
				<span>Please confirm your password</span>
				<div class="password-wrapper">
					<input
						:type="confirmedPasswordFieldType"
						v-model="confirmed_password"
						placeholder="**********"
						@keyup.enter.stop />
					<button
						type="button"
						@click.prevent="toggleConfirmedPasswordVisibility"
						class="toggle-password">
						<i
							:class="
								showConfirmedPassword ? 'bi bi-eye-slash' : 'bi bi-eye'
							"></i>
					</button>
				</div>
			</label>

			<input
				type="submit"
				value="Register" />
		</form>

		<div class="flex"></div>

		<footer>
			<!-- &nbsp; is a non-breaking space and displays the text nicely -->
			Already have an account?&nbsp;
			<router-link to="/login">Log in here</router-link>
		</footer>
	</main>
</template>

<script>
	import { ref, onMounted, onUnmounted, reactive, computed } from 'vue';
	import { useRouter } from 'vue-router';
	import { useStore } from 'vuex';

	export default {
		props: ['menuOpen'],
		data() {
			return {
				password: '',
				feedbackMessage: '',
				feedbackWarning: '',
				feedbackScore: '0',
				passwordStrengthFeedback: '',
				showPassword: false,
				showConfirmedPassword: false,
			};
		},
		computed: {
			passwordFieldType() {
				return this.showPassword ? 'text' : 'password';
			},
			confirmedPasswordFieldType() {
				return this.showConfirmedPassword ? 'text' : 'password';
			},
		},
		methods: {
			async checkPasswordStrength(password) {
				try {
					// post request to server API with password as body
					const response = await fetch(
						'http://localhost:3333/password-strength-check',
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								password: password,
							}),
						}
					);

					const result = await response.json();
					if (result.success) {
						this.feedbackMessage = result.feedback[0];
						this.feedbackWarning = result.warning;
						this.feedbackScore = result.score;
					} else {
						console.error('Password strength check failed:', result.message);
					}
				} catch (error) {
					console.error('Error checking password strength:', error);
					this.passwordStrengthFeedback = JSON.stringify({
						error: 'Error checking password strength',
						message: error.toString(),
					});
				}
			},
			togglePasswordVisibility() {
				this.showPassword = !this.showPassword;
			},
			toggleConfirmedPasswordVisibility() {
				this.showConfirmedPassword = !this.showConfirmedPassword;
			},
			getStopColor(score) {
				const colors = ['darkred', 'red', 'orange', 'yellow', 'green'];
				return `stop-color:${colors[score]};stop-opacity:1`;
			},
		},
		setup(props) {
			const router = useRouter();
			const store = useStore();

			// reactive variables for user input
			const email = ref('');
			const password = ref('');
			const confirmed_password = ref('');

			// function to handle user registration
			const Register = async () => {
				// validation of user's inputs in register form
				if (!email.value || !password.value || !confirmed_password.value) {
					return alert('Please fill in all fields');
				}
				if (password.value !== confirmed_password.value) {
					return alert('Passwords do not match');
				}

				// API call to Stytch via server to register user
				const res = await fetch('http://localhost:3333/register', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: email.value,
						password: password.value,
					}),
				}).then((res) => res.json());

				// handling API response
				if (res.success) {
					// save token to local storage, commit userId to store, and navigate to home page
					localStorage.setItem('token', res.token);
					if (res.userId) {
						store.commit('setUserId', res.userId);
					}
					router.push('/');
				} else {
					// display alert for failed registration
					alert(res.message);
				}
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
				confirmed_password,
				Register,
				marginLeft,
			};
		},
	};
</script>

<style lang="scss">
	.flex {
		flex: 1 1 0;
	}

	#lock {
		width: 100px;
		height: auto;
		position: relative;
		z-index: 1;
	}
</style>
