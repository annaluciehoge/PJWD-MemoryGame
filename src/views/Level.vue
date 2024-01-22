<template>
	<main :style="{ 'margin-left': marginLeft }">
		<header>
			<h1>Level {{ level }}</h1>
		</header>
		<div
			class="content"
			ref="gameContainer">
			<p v-if="formattedHighScore">High Score: {{ formattedHighScore }}</p>
		</div>
		<vue-confetti ref="confetti" />
	</main>
</template>

<script>
	import Phaser from 'phaser';
	import PreloadScene from '../scenes/PreloadScene.js';
	import GameScene from '../scenes/GameSceneL1.js';
	import GameSceneL2 from '../scenes/GameSceneL2.js';
	import BackgroundScene from '../scenes/BackgroundScene.js';
	import { useToast } from 'vue-toastification';
	import { h, onMounted, onUnmounted, reactive, computed } from 'vue';
	import VueConfetti from 'vue-confetti';

	export default {
		name: 'Level',
		props: ['level', 'menuOpen'],
		data() {
			return {
				game: null,
				gameConfig: null,
			};
		},
		components: {
			VueConfetti,
		},
		computed: {
			userId() {
				return this.$store.state.userId;
			},
			score() {
				return this.$store.state.score;
			},
			newHighScore() {
				return this.$store.state.highScores[`level${this.level}`];
			},
			formattedHighScore() {
				if (this.newHighScore && this.newHighScore !== Infinity) {
					let minutes = Math.floor(this.newHighScore / 60);
					let seconds = this.newHighScore % 60;
					return `${minutes.toString().padStart(2, '0')}:${seconds
						.toString()
						.padStart(2, '0')}`;
				}
				return null;
			},
		},

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

		methods: {
			sendScoreToBackend() {
				const data = {
					userId: this.userId,
					score: this.score,
					level: this.level,
				};

				fetch('http://localhost:3333/scores', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				})
					.then((response) => {
						if (!response.ok) {
							throw new Error(`HTTP error! status: ${response.status}`);
						}
						return response.json();
					})
					.catch((error) => {
						console.error('Error:', error);
					});
			},

			createGame() {
				let width, height, gameScene;
				if (this.level === '1') {
					width = 700;
					height = 600;
					gameScene = GameScene;
				} else if (this.level === '2') {
					width = 800;
					height = 720;
					gameScene = GameSceneL2;
				}

				this.gameConfig = {
					type: Phaser.AUTO,
					width: width,
					height: height,
					parent: this.$refs.gameContainer,
					scene: [PreloadScene, BackgroundScene, gameScene],
					physics: {
						default: 'arcade',
						arcade: {
							gravity: { y: 0 },
							debug: false, // set to false in production
						},
					},
				};

				this.game = new Phaser.Game(this.gameConfig);

				const toast = useToast();

				this.game.events.once('ready', () => {
					this.game.scene.scenes[2].events.on(
						'gameEnded',
						this.sendScoreToBackend.bind(this)
					);
					this.game.scene.scenes[2].events.on('newHighScore', () => {
						setTimeout(() => {
							this.$confetti.start();
							setTimeout(() => {
								this.$confetti.stop();
							}, 6484); //same as toast timeout

							toast.success(
								h('div', { style: 'margin-left: 1rem;' }, [
									h('h2', {}, 'New high score!'),
									h('p', {}, 'Congratulations!'),
								]),
								{
									icon: h('span', {
										class: 'bi bi-check2-all',
										style: 'font-size: 2rem;',
									}),
									onClose: () => this.$confetti.stop(), // Stop the confetti when the toast is closed
								}
							);
						}, 2000); // Delay of 2 seconds
					});
				});

				this.$store.dispatch('fetchHighScores');
			},
		},

		mounted() {
			this.createGame();
		},

		beforeDestroy() {
			if (this.game) {
				this.game.scene.scenes[2].shutdown();
				this.game.scene.scenes[2].events.off(
					'gameEnded',
					this.sendScoreToBackend.bind(this)
				);
				this.game.destroy(true);
			}
		},

		beforeRouteLeave(to, from, next) {
			if (this.game) {
				this.game.scene.scenes[2].shutdown();
				this.game.scene.scenes[2].events.off(
					'gameEnded',
					this.sendScoreToBackend.bind(this)
				);
				this.game.destroy(true);
			}

			// Continue with the route change
			next();
		},
	};
</script>
../scenes/GameSceneL1.js
