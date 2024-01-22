<template>
	<main :style="{ 'margin-left': marginLeft }">
		<header>
			<h4>Your Account</h4>
		</header>

		<div
			id="profileInformation"
			class="content inputForm">
			<p><strong>email:</strong> {{ userEmail }}</p>
			<p><strong>Account created at:</strong> {{ userCreatedAt }}</p>
		</div>
	</main>
</template>

<script>
	import { computed, onMounted, onUnmounted, reactive } from 'vue';

	export default {
		props: ['menuOpen'],
		setup(props) {
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
				marginLeft,
			};
		},
		data() {
			return {
				userEmail: '',
				userCreatedAt: '',
			};
		},
		created() {
			this.fetchUserData();
		},
		methods: {
			fetchUserData() {
				const token = localStorage.getItem('token');

				fetch('http://localhost:3333/user_info', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then((response) => {
						if (!response.ok) {
							throw new Error(`HTTP error! status: ${response.status}`);
						}
						return response.json();
					})
					.then((data) => {
						this.userEmail = data.email;
						let date = new Date(data.createdAt);
						let day = date.getDate().toString().padStart(2, '0'); // get the day
						let monthNames = [
							'JAN',
							'FEB',
							'MAR',
							'APR',
							'MAY',
							'JUN',
							'JUL',
							'AUG',
							'SEP',
							'OCT',
							'NOV',
							'DEC',
						];
						let month = monthNames[date.getMonth()]; // get the month abbreviation
						let year = date.getFullYear(); // get the year

						this.userCreatedAt = `${day}. ${month} ${year}`;
					})
					.catch((error) => {
						console.error('Error:', error);
					});
			},
		},
	};
</script>

<style scoped>
	#profileInformation {
		height: auto;
	}
</style>
