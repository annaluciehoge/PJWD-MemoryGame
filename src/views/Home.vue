<template>
	<main :style="marginLeft">
		<header>
			<h1>Welcome to the Memory Game!</h1>
		</header>

		<div class="content">
			<p>
				Welcome to the Memory Game! You can view your account information on the
				<router-link to="/profile">Profile</router-link> page. Play the Memory
				Game on the
				<router-link to="/game">Game</router-link>
				page and view your scores on the
				<router-link to="/scores">Scores</router-link>
				page. Have fun!
			</p>
		</div>

		<footer>
			<p>
				Fonts from https://fonts.google.com<br />
				Images from https://www.kenney.nl<br />
				Icons from https://icons.getbootstrap.com<br />
				Music and sound from https://www.zapsplat.com
			</p>
		</footer>
	</main>
</template>

<script setup>
	import { onMounted, onUnmounted, reactive, computed, defineProps } from 'vue';

	const props = defineProps({
		menuOpen: Boolean,
	});

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
		if (windowSize.width > 768) {
			return { 'margin-left': props.menuOpen ? '300px' : 'calc(2rem + 32px)' };
		} else {
			return {};
		}
	});
</script>

<style scoped>
	.main {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.content {
		flex-grow: 1;
	}
</style>
