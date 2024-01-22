<template>
	<aside :class="{ menuOpen: menuOpen }">
		<div class="menu-toggle-wrap">
			<button
				class="menu-toggle"
				@click="ToggleMenu">
				<i class="bi bi-caret-right"></i>
			</button>
		</div>
		<h3>Menu</h3>
		<div class="menu">
			<router-link
				to="/"
				class="button">
				<i class="bi bi-house"></i>
				<span class="navbar-text">Home</span>
			</router-link>
			<router-link
				to="/game"
				class="button">
				<i class="bi bi-controller"></i>
				<span class="navbar-text">Game</span>
			</router-link>
			<router-link
				to="/scores"
				class="button">
				<i class="bi bi-trophy"></i>
				<span class="navbar-text">Scores</span>
			</router-link>
			<router-link
				to="/profile"
				class="button">
				<i class="bi bi-person-circle"></i>
				<span class="navbar-text">Profile</span>
			</router-link>
		</div>

		<div class="flex"></div>

		<div class="menu">
			<!-- if toggle-appearance-button is clicked, value of reactive variable darkMode in App.vue is toggled, and icon changes -->
			<button
				@click.prevent="props.toggleDarkMode"
				class="button">
				<i
					v-if="props.darkMode"
					class="bi bi-sun"></i>
				<i
					v-else
					class="bi bi-moon-stars"></i>
				<span class="navbar-text">Appearance</span>
			</button>

			<button
				@click.prevent="Logout"
				class="button">
				<i class="bi bi-box-arrow-left"></i>
				<span class="navbar-text">Log Out</span>
			</button>
		</div>
	</aside>
</template>

<script setup>
	import { ref, defineProps, defineEmits } from 'vue';
	import { useStore } from 'vuex';
	import { useToast } from 'vue-toastification';

	// props for toggling dark mode and dark mode state
	const props = defineProps({
		toggleDarkMode: Function,
		darkMode: Boolean,
	});

	const emit = defineEmits(['menu-toggle']);

	// local storage is used to save state of menu -> if user refreshes page, menu will stay open/closed
	const menuOpen = ref(localStorage.getItem('menuOpen') === 'true');
	const ToggleMenu = () => {
		menuOpen.value = !menuOpen.value;
		localStorage.setItem('menuOpen', menuOpen.value);
		emit('menu-toggle', menuOpen.value);
	};

	// Vuex store instance to call logout function from store and toast instance to display success/error messages
	const store = useStore();
	const toast = useToast();

	const Logout = async () => {
		try {
			const res = await store.dispatch('logout');
			toast.success('Successfully logged out');
		} catch (error) {
			toast.error(error.message);
		}
	};
</script>

<style lang="scss" scoped>
	// sidebar styling
	aside {
		display: flex;
		flex-direction: column;
		width: var(--navbar-closed-width);
		min-height: 100vh;
		padding: 1rem;
		overflow: hidden;
		position: fixed;
		left: 0;
		// z-index makes sure that navbar is on top of content if content shifts to left on smaller devices
		z-index: 99;
		background-color: var(--primary_3);
		color: var(--secondary_3);
		transition: 0.2s ease-out;

		// styling of the flex element that is used to push the logout button to the bottom of the sidebar
		.flex {
			flex: 1 1 0;
		}

		// default styling of menu toggle button if menu is closed
		.menu-toggle-wrap {
			display: flex;
			justify-content: flex-end;
			margin-bottom: 1rem;
			position: relative;
			top: 1rem;
			transition: 0.2s ease-out;

			.menu-toggle {
				transition: 0.2s ease-out;

				i {
					font-size: 2rem;
					color: var(--secondary_3);
					transition: 0.2s ease-out;
				}

				&:hover {
					i {
						color: var(--secondary_1);
					}
				}
			}
		}

		// styling of menu toggle button if menu is open
		&.menuOpen {
			width: var(--navbar-opened-width);
			.menu-toggle-wrap {
				top: -1.2rem;
				.menu-toggle {
					padding-left: 0rem;
					transform: rotate(-180deg);
				}
			}
			h3,
			.button,
			.navbar-text {
				opacity: 1;
			}

			.button {
				i {
					margin-right: 1rem;
				}
			}
		}

		.button {
			opacity: 1;
			transition: 0.3s ease-out;
		}

		h3,
		.navbar-text {
			opacity: 0;
			transition: 0.3s ease-out;
		}
		// styling of menu
		.menu {
			margin: 0 -1rem;

			.button {
				display: flex;
				align-items: center;
				text-decoration: none;
				padding: 0.5rem 1rem;
				transition: 0.2s ease-out;
				width: 100%;
				box-sizing: border-box;

				i {
					font-size: 2rem;
					color: var(--secondary_3);
					transition: 0.2s ease-out;
				}

				.navbar-text {
					color: var(--secondary_3);
					transition: 0.2s ease-out;
					text-decoration: none;
					font-weight: normal;
				}

				// styling of navbar button if it is hovered over or active
				&:hover,
				&.router-link-exact-active {
					background-color: var(--hover);

					i,
					.navbar-text {
						color: var(--secondary_2);
						font-weight: bold;
					}
				}

				// styling of border for navbar button if it is active to indicate that it is active
				&.router-link-exact-active {
					border-right: 0.35rem solid var(--secondary_5);
				}
			}
		}

		h3 {
			margin-bottom: 1rem;
			font-size: 1.5rem;
		}

		@media (max-width: 768px) {
			position: fixed;
			z-index: 99;
		}
	}
</style>
