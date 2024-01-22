<!-- if more levels are added to the game, you must update totalLevels manually in the vuex store (store.js)! -->
<template>
	<main :style="marginLeft">
		<header>
			<h1>Train your Brain</h1>
		</header>
		<div class="content">
			<p>
				Play the memory game by moving the hero around with the
				<strong>arrow keys</strong> or the <strong>WASD keys</strong> and open
				the boxes by pressing the <strong>space bar</strong> once the box lights
				up to find each pair of matching animal images. Turn on your sound to
				enjoy the full game experience.<br />
				You cannot pause the game while playing a level, and your score is saved
				automatically if you finish the level.
			</p>
			<p v-if="highestLevel < totalLevels">
				Play level {{ highestLevel }} to unlock the next level.
			</p>
			<p v-else-if="highestLevel === totalLevels">
				One more level to go! Play level {{ highestLevel }} to finish all
				levels.
			</p>
			<p v-else>
				Congratulations, you have played all levels! <br />
				The deck is shuffled in each new round, so feel free to play each level
				again. Come back soon to check for new levels.
			</p>
			<ul>
				<li
					v-for="level in totalLevels"
					:key="level">
					<div class="thumbnail">
						<router-link
							:to="
								level <= highestLevel
									? { name: 'Level', params: { level: level.toString() } }
									: {}
							"
							:class="{ 'grayed-out': level > highestLevel }">
							<img
								:src="'/textures/Level' + level + '.png'"
								:alt="'Level ' + level + ' thumbnail'" />
							<p class="thumbnail-text">Level {{ level }}</p>
						</router-link>
					</div>
				</li>
			</ul>
		</div>
	</main>
</template>

<script setup>
	import { onMounted, onUnmounted, reactive, computed, defineProps } from 'vue';
	import { useStore } from 'vuex';

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
	const store = useStore();
	const highestLevel = computed(() => store.state.highestLevel);
	const totalLevels = computed(() => store.state.totalLevels);
</script>

<style scoped>
	ul {
		list-style: none;
		padding: 0;
	}
	.thumbnail {
		position: relative;
		width: 200px;
		height: 200px;
		margin: 30px;
	}

	.thumbnail img {
		width: 100%;
		height: 100%;
	}

	.thumbnail-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		font-size: 24px;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}

	.grayed-out {
		filter: grayscale(100%);
		pointer-events: none;
	}
</style>
