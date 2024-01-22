<template>
	<main :style="{ 'margin-left': marginLeft }">
		<header>
			<h1>Your Scores</h1>
		</header>
		<div class="container">
			<div class="high-scores">
				<div id="scores-div-1">
					<h2>
						<span style="font-weight: 400">Level 1 </span>
						<span style="font-weight: 500">High Score</span>
					</h2>
					<ul>
						<li v-if="scoresLevel1.length === 0">No high score yet</li>
						<li v-else>{{ highScoreLevel1 }}</li>
					</ul>
				</div>
				<div id="scores-div-2">
					<h2>
						<span style="font-weight: 400">Level 2 </span>
						<span style="font-weight: 500">High Score</span>
					</h2>
					<ul>
						<li v-if="scoresLevel2.length === 0">No high score yet</li>
						<li v-else>{{ highScoreLevel2 }}</li>
					</ul>
				</div>
			</div>
			<div class="scores">
				<div id="scores-div-3">
					<h2>
						<span style="font-weight: 400">Level 1 </span>
						<span style="font-weight: 500">Scores</span>
					</h2>
					<ul>
						<li v-if="scoresLevel1.length === 0">No scores yet</li>
						<li
							v-else
							v-for="(score, index) in scoresLevel1"
							:key="index">
							{{ formatTime(score.score) }}
						</li>
					</ul>
				</div>
				<div id="scores-div-4">
					<h2>
						<span style="font-weight: 400">Level 2 </span>
						<span style="font-weight: 500">Scores</span>
					</h2>
					<ul>
						<li v-if="scoresLevel2.length === 0">No scores yet</li>
						<li
							v-else
							v-for="(score, index) in scoresLevel2"
							:key="index">
							{{ formatTime(score.score) }}
						</li>
					</ul>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
	import { mapState } from 'vuex';
	import { onMounted, onUnmounted, reactive, computed } from 'vue';

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
				scores: [],
			};
		},
		computed: {
			...mapState(['userId']),
			scoresLevel1() {
				return this.scores.filter((score) => score.level === 1);
			},
			scoresLevel2() {
				return this.scores.filter((score) => score.level === 2);
			},
			highScoreLevel1() {
				const values = this.scoresLevel1.map((score) => score.score);
				return values.length ? this.formatTime(Math.min(...values)) : null;
			},
			highScoreLevel2() {
				const values = this.scoresLevel2.map((score) => score.score);
				return values.length ? this.formatTime(Math.min(...values)) : null;
			},
		},
		methods: {
			fetchScores() {
				fetch(`http://localhost:3333/scores?userId=${this.userId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				})
					.then((response) => {
						if (!response.ok) {
							throw new Error(`HTTP error! status: ${response.status}`);
						}
						return response.json();
					})
					// sorting by entry_id to display latest scores on top
					.then((data) => {
						this.scores = data.sort((a, b) => b.entry_id - a.entry_id);
					})
					.catch((error) => {
						console.error('Error:', error);
					});
			},
			// format time in seconds to MM:SS
			formatTime(seconds) {
				const minutes = Math.floor(seconds / 60);
				const remainingSeconds = seconds % 60;
				return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
					.toString()
					.padStart(2, '0')}`;
			},
		},
		mounted() {
			this.fetchScores();
		},
	};
</script>

<style scoped>
	ul {
		list-style-type: none;
		padding: 0;
	}
	.container {
		display: flex;
		flex-direction: column;
		text-align: left;
		width: 75%;
		margin: auto;
		margin-top: 0px;
	}

	.high-scores,
	.scores {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin-right: auto;
		div {
			border: 1px;
			border-style: solid;
			border-radius: 5px;
			padding-top: 10px;
			margin: 10px;
		}
	}

	.high-scores > div,
	.scores > div {
		text-align: center;
		width: 640px;
	}

	@media (max-width: 720px) {
		.high-scores,
		.scores {
			flex-direction: column;
		}
		.high-scores > div,
		.scores > div {
			width: 100%;
		}
	}
</style>
