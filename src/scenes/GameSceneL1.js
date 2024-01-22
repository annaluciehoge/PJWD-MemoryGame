import Phaser from 'phaser';
import StopwatchController from './StopwatchController';
import store from '../store.js';

export default new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function GameScene() {
		Phaser.Scene.call(this, { key: 'GameScene' });

		// class properties
		// ghost is 0
		this.level = [
			[1, 0, 3],
			[2, 4, 1],
			[3, 4, 2],
		];

		/** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
		this.cursors = null;

		// JSDoc comments for type hinting and autocompletion in VSCode in the game context
		/** @type {Phaser.Physics.Arcade.Sprite} */
		this.player = null;

		/** @type {Phaser.Physics.Arcade.StaticGroup} */
		this.boxGroup = null;

		/** @type {Phaser.Physics.Arcade.Sprite} */
		this.activeBox = null;

		// total number of boxes based on level array
		this.totalBoxes = [].concat(...this.level).length;

		/** @type {Phaser.GameObjects.Group} */
		this.itemsGroup = null;

		/** @type { box: Phaser.Physics.Arcade.Sprite, item: Phaser.GameObjects.Sprite} */
		this.selectedBoxes = [];

		/** @type {StopwatchController} */
		this.stopwatch = null;

		this.matchCount = 0;

		// number of ghosts (0s in the level array)
		const ghosts = [].concat(...this.level).filter((item) => item === 0);
		this.totalGhosts = ghosts.length;
	},

	// no preload needed, because all assets are loaded in PreloadScene.js

	create: function () {
		this.currentLevel = 'level1';

		this.successMatchSound = this.sound.add('success-match-sound');
		this.winSound = this.sound.add('win-sound');
		this.chickSound = this.sound.add('chick-sound');
		this.chickenSound = this.sound.add('chicken-sound');
		this.ghostSound = this.sound.add('ghost-sound');
		this.owlSound = this.sound.add('owl-sound');
		this.penguinSound = this.sound.add('penguin-sound');
		this.highscoreSound = this.sound.add('highscore-sound');
		this.backgroundMusic = this.sound.add('background-music');

		// Flatten the 2D array into a 1D array
		const flattenedLevel = [].concat(...this.level);
		// Shuffle the 1D array
		const shuffledLevel = this.randomizeArray(flattenedLevel);
		// Determine the level width dynamically
		const levelWidth = this.level[0].length;
		// Reshape the 1D array back into a 2D array
		this.level = [];
		while (shuffledLevel.length)
			this.level.push(shuffledLevel.splice(0, levelWidth));

		this.scene.launch('BackgroundScene');

		this.cursors = this.input.keyboard.createCursorKeys();
		this.wasdKeys = this.input.keyboard.addKeys({
			w: Phaser.Input.Keyboard.KeyCodes.W,
			s: Phaser.Input.Keyboard.KeyCodes.S,
			a: Phaser.Input.Keyboard.KeyCodes.A,
			d: Phaser.Input.Keyboard.KeyCodes.D,
		});

		let sceneWidth = this.sys.game.canvas.width;
		let sceneHeight = this.sys.game.canvas.height;

		// x, y, width, and height of the world bounds
		let boundsX = 20;
		let boundsY = sceneHeight / 20 + sceneHeight / 6 / 2 + 20;
		let boundsWidth = sceneWidth - 40;
		let boundsHeight =
			sceneHeight - (sceneHeight / 20 + sceneHeight / 6 / 2) - 40;
		this.physics.world.setBounds(boundsX, boundsY, boundsWidth, boundsHeight);

		const { width, height } = this.scale;
		// multiplication with 0.5 centers sprite horizontally
		this.player = this.physics.add
			.sprite(width * 0.5, height * 0.64, 'sokoban')
			.play('down-idle')
			.setSize(40, 16)
			.setOffset(12, 38);

		this.player.setCollideWorldBounds(true);

		this.boxGroup = this.physics.add.staticGroup();

		this.createBoxes();

		this.itemsGroup = this.add.group();

		this.timerLabel = this.add
			.text(width * 0.5, 50, '00:00', { fontSize: 48 })
			.setOrigin(0.5);

		this.stopwatch = new StopwatchController(this, this.timerLabel);

		this.physics.add.collider(
			this.player,
			this.boxGroup,
			this.playerBoxCollision,
			undefined,
			this
		);

		// flag to indicate whether the game is checking for a match
		this.isChecking = false;

		// initialize the game state to indicate that game is not yet running
		this.gameState = 'start';

		this.restartGame = () => {
			this.shutdown();
			this.restartButton.destroy();
			this.restartButtonIcon.destroy();
			this.restartButtonTooltip.destroy();
			this.restartButtonOutline.clear(true, true);
			this.scene.restart();
			this.isChecking = false;
			this.gameState = 'start';
		};

		// event listeners for space bar and enter key (would also be listened to in login form after logout -> event listeners were needed here to prevent the game from starting when pressing space or enter in the login form)
		this.input.keyboard.on('keydown-SPACE', () => {
			if (this.scene.isActive() && this.gameState === 'start') {
				this.startGame();
			} else if (this.scene.isActive() && this.gameState === 'playing') {
				this.openBox();
			} else if (this.scene.isActive() && this.gameState === 'end') {
				this.restartGame();
			}
		});
		this.input.keyboard.on('keydown-ENTER', () => {
			if (this.scene.isActive() && this.gameState === 'start') {
				this.startGame();
			} else if (this.scene.isActive() && this.gameState === 'end') {
				this.restartGame();
			}
		});

		// info text to let user know how to navigate the game
		// background for info text
		this.infoTextBG = this.add
			.rectangle(width / 2, height / 2 - 75, 390, 300, 0xffffff)
			.setFillStyle(0xffffff, 0.8);
		this.infoText = this.add.text(
			width / 2,
			height / 2,
			'Use the space bar and the arrow keys/WASD to navigate the hero and open the boxes. Find the matching pairs as quickly as you can to finish the game with a new high score. But be careful not to run into the ghost...',
			{
				color: '#000000',
				align: 'center',
				fontSize: 25,
				wordWrap: { width: 350 },
			}
		);
		// center-align text in the rectangle
		Phaser.Display.Align.In.Center(this.infoText, this.infoTextBG);

		// group for outline with outline elements to imitate a button
		this.startButtonOutline = this.add.group();
		this.startButtonOutline.add(
			this.add.rectangle(width / 2, height / 2 + 105 - 40, 200, 2, 0x000000)
		);
		this.startButtonOutline.add(
			this.add.rectangle(width / 2, height / 2 + 105 + 40, 200, 2, 0x000000)
		);
		this.startButtonOutline.add(
			this.add.rectangle(width / 2 - 100, height / 2 + 105, 2, 80, 0x000000)
		);
		this.startButtonOutline.add(
			this.add.rectangle(width / 2 + 100, height / 2 + 105, 2, 80, 0x000000)
		);

		// red rectangle for the start button
		this.startButton = this.add
			.rectangle(width / 2, height / 2 + 105, 200, 80, 0xff0000)
			.setInteractive({ cursor: 'pointer' });
		this.startButtonText = this.add
			.text(width / 2, height / 2, 'Start', {
				color: '#ffffff',
				align: 'center',
				fontSize: 48,
			})
			.setShadow(2, 2, '#262626', 2);
		// Center align text in the rectangle
		Phaser.Display.Align.In.Center(this.startButtonText, this.startButton);
		this.startButton.on('pointerdown', () => {
			this.startGame();
		});

		this.startGame = () => {
			if (this.gameState !== 'start') {
				return;
			}

			this.startButton.destroy();
			this.startButtonText.destroy();
			this.infoText.destroy();
			this.infoTextBG.destroy();
			this.startButtonOutline.clear(true, true);

			this.backgroundMusic.volume = 0.4;
			this.backgroundMusic.loop = true;
			this.backgroundMusic.play();

			store.dispatch('fetchHighScores').then(() => {
				this.highScores = store.state.highScores;
			});

			// set flag to indicate that game has started
			this.gameState = 'playing';

			this.stopwatch.start();
		};
	},

	// Fisher-Yates shuffle algorithm to randomize array on each game start
	randomizeArray: function (array) {
		for (let i = array.length - 1; i > 0; i--) {
			const randomIndex = Math.floor(Math.random() * (i + 1));
			const temp = array[i];
			array[i] = array[randomIndex];
			array[randomIndex] = temp;
		}
		return array;
	},

	createBoxes: function () {
		const width = this.scale.width;
		let y = 180;
		for (let row = 0; row < this.level.length; row++) {
			// calculate xPer based on the number of columns to ensure that boxes are evenly spaced and centered
			let xPer = 1 / (this.level[row].length + 1);
			for (let col = 0; col < this.level[row].length; col++) {
				/** @type {Phaser.Physics.Arcade.Sprite} */
				const box = this.boxGroup.get(width * xPer, y, 'sokoban', 19);
				box
					.setSize(64, 32)
					.setOffset(0, 32)
					.setData('animalType', this.level[row][col]);

				// increment xPer by the same amount for each box
				xPer += 1 / (this.level[row].length + 1);
			}
			y += 150;
		}
	},

	/**
	 *
	 * @param {Phaser.Physics.Arcade.Sprite} player
	 * @param {Phaser.Physics.Arcade.Sprite} box
	 */
	playerBoxCollision: function (player, box) {
		const opened = box.getData('opened');
		if (this.isChecking || opened || this.activeBox) {
			return;
		}
		this.activeBox = box;
		// if player is near the box, change color to light brown (box in frame 6 in spritesheet)
		this.activeBox.setFrame(6);
	},

	/**
	 *
	 * @param {Phaser.Physics.Arcade.Sprite} box
	 */
	openBox: function (box) {
		if (!box || this.isChecking) {
			return;
		}

		const animalType = box.getData('animalType');

		/** @type {Phaser.GameObjects.Sprite} */
		let item;
		switch (animalType) {
			case 0:
				this.isChecking = true;
				item = this.itemsGroup.get(box.x, box.y);
				item.setTexture('ghost');
				this.ghostSound.play();
				break;
			case 1:
				item = this.itemsGroup.get(box.x, box.y);
				item.setTexture('chick');
				this.chickSound.play();
				break;
			case 2:
				item = this.itemsGroup.get(box.x, box.y);
				item.setTexture('chicken');
				this.chickenSound.play();
				break;
			case 3:
				item = this.itemsGroup.get(box.x, box.y);
				item.setTexture('owl');
				this.owlSound.play();
				break;
			case 4:
				item = this.itemsGroup.get(box.x, box.y);
				item.setTexture('penguin');
				this.penguinSound.play();
				break;
		}
		if (!item) {
			return;
		}

		box.setData('opened', true);

		item.setData('sorted', true);
		item.setDepth(2000);

		item.scale = 0;
		item.alpha = 0;

		let scaleValue = 0.65;

		// check if item is a ghost and set a smaller scale because ghost comes from different spritesheet and is bigger by default
		if (item.texture.key === 'ghost') {
			scaleValue = 0.45;
		}

		this.selectedBoxes.push({ box, item });

		if (this.selectedBoxes.length === 2) {
			this.isChecking = true;
		}

		this.tweens.add({
			targets: item,
			y: '-=55',
			alpha: 1,
			scale: scaleValue,
			duration: 500,
			// onComplete is asynchronous
			onComplete: () => {
				if (animalType === 0) {
					this.ghostSelected();
					return;
				}

				if (this.selectedBoxes.length < 2) {
					return;
				}
				this.checkForMatch();
			},
		});

		this.activeBox.setFrame(19);
		this.activeBox = undefined;
	},

	ghostSelected: function () {
		this.isChecking = true;

		const { box, item } = this.selectedBoxes.pop();
		box.setFrame(7);

		this.player.setTint(0xff0000);
		this.player.active = false;
		this.player.setVelocity(0, 0);

		// don't let player move for 1.5 seconds after selecting ghost
		this.time.delayedCall(1500, () => {
			box.setFrame(19);

			box.setData('opened', false);

			this.tweens.add({
				targets: item,
				y: '+=55',
				alpha: 0,
				scale: 0,
				duration: 300,
				onComplete: () => {
					this.player.clearTint();
					this.player.active = true;
					this.isChecking = false;
				},
			});
		});
	},

	// checkForMatch works very well but got a bit too long, could be refactored in the future
	checkForMatch: function () {
		this.isChecking = true;

		const second = this.selectedBoxes.pop();
		const first = this.selectedBoxes.pop();

		// if both boxes are ghosts, do not consider them a match (should not happen anyway because the ghostSelected function should be called first and close the box immediately)
		if (
			first.item.texture.key === 'ghost' &&
			second.item.texture.key === 'ghost'
		) {
			this.isChecking = false;
			return;
		}

		if (first.item.texture.key !== second.item.texture.key) {
			this.tweens.add({
				targets: [first.item, second.item],
				y: '+=55',
				alpha: 0,
				scale: 0,
				duration: 300,
				delay: 1000,
				onComplete: () => {
					first.box.setData('opened', false);
					second.box.setData('opened', false);
					this.isChecking = false;
				},
			});
			return;
		}

		++this.matchCount;

		this.time.delayedCall(500, () => {
			first.box.setFrame(9);
			second.box.setFrame(9);
			this.successMatchSound.play();

			const totalMatches = (this.totalBoxes - this.totalGhosts) / 2;

			if (this.matchCount >= totalMatches) {
				// game won

				this.player.active = false;
				this.player.setVelocity(0, 0);
				// reset counter so that game can be played again with same counter variable
				this.matchCount = 0;
				this.gameState = 'end';
				this.stopwatch.stop();
				// elapsedTime measures how long it took the player to find all matches
				const elapsedTime = this.stopwatch.elapsedTime;
				store.dispatch('setScore', elapsedTime);

				// Check if a new high score has been achieved
				let isNewHighScore = false;
				if (
					this.currentLevel === 'level1' &&
					(this.highScores.level1 === null ||
						elapsedTime < this.highScores.level1)
				) {
					this.events.emit('newHighScore');
					isNewHighScore = true;
					this.time.delayedCall(1000, () => {
						this.highscoreSound.play();
					});
					store.commit('setHighScore', { level: 'level1', score: elapsedTime });
				} else if (
					this.currentLevel === 'level2' &&
					(this.highScores.level2 === null ||
						elapsedTime < this.highScores.level2)
				) {
					this.events.emit('newHighScore');
					isNewHighScore = true;
					this.time.delayedCall(1000, () => {
						this.highscoreSound.play();
					});
					store.commit('setHighScore', {
						level: 'level2',
						score: elapsedTime,
					});
				}

				let levelNumber = Number(this.currentLevel.replace('level', ''));
				if (!isNaN(levelNumber)) {
					let newHighestLevel = levelNumber + 1;
					store.commit('setHighestLevel', newHighestLevel);
					localStorage.setItem('highestLevel', newHighestLevel);
				}

				this.events.emit('gameEnded');

				this.time.delayedCall(1000, () => {
					this.backgroundMusic.stop();
					if (!isNewHighScore) {
						this.winSound.play();
					}

					const { width, height } = this.scale;
					this.add
						.text(width * 0.5, height * 0.92, 'You win!', {
							fontSize: '64px',
							color: '#ffffff',
							shadow: {
								color: '#000000',
								fill: true,
								offsetX: 2,
								offsetY: 2,
								blur: 5,
							},
							padding: {
								left: 16,
								right: 16,
								top: 8,
								bottom: 8,
							},
						})
						.setOrigin(0.5)
						.setDepth(3000)
						.setData('sorted', true);
				});

				let restartButtonDelay = isNewHighScore ? 8000 : 3000;

				this.time.delayedCall(restartButtonDelay, () => {
					const { width, height } = this.scale;

					// restart button to play the game again, is built very similar to the start button
					this.restartButton = this.add
						.rectangle(width / 2, height / 2 + 105, 150, 80, 0xff0000)
						.setInteractive({ cursor: 'pointer' })
						.setDepth(3000)
						.setData('sorted', true);

					this.restartButtonOutline = this.add.group();
					this.restartButtonOutline.add(
						this.add
							.rectangle(width / 2, height / 2 + 105 - 40, 150, 2, 0x000000)
							.setDepth(3000)
					);
					this.restartButtonOutline.add(
						this.add
							.rectangle(width / 2, height / 2 + 105 + 40, 150, 2, 0x000000)
							.setDepth(3000)
					);
					this.restartButtonOutline.add(
						this.add
							.rectangle(width / 2 - 75, height / 2 + 105, 2, 80, 0x000000)
							.setDepth(3000)
					);
					this.restartButtonOutline.add(
						this.add
							.rectangle(width / 2 + 75, height / 2 + 105, 2, 80, 0x000000)
							.setDepth(3000)
					);
					this.restartButtonOutline
						.getChildren()
						.forEach((child) => child.setData('sorted', true));
					this.restartButtonIcon = this.add
						.image(width / 2, height / 2 + 105, 'restartIcon')
						.setScale(1.5)
						.setDepth(4000)
						.setData('sorted', true);
					Phaser.Display.Align.In.Center(
						this.restartButton,
						this.restartButtonIcon
					);
					// tooltip text object, initially invisible
					this.restartButtonTooltip = this.add
						.text(width / 2, height / 2 + 145, 'restart level', {
							color: '#ffffff',
							align: 'center',
							fontSize: 20,
							backgroundColor: '#000000',
						})
						.setOrigin(0.5, 0)
						.setDepth(4000)
						.setVisible(false);
					this.restartButton.on('pointerover', () => {
						this.restartButtonTooltip.setVisible(true);
					});
					this.restartButton.on('pointerout', () => {
						this.restartButtonTooltip.setVisible(false);
					});
					this.restartButton.on('pointerdown', () => {
						this.restartGame();
					});
				});
			} else {
				// only executed if game is not won yet, but a match has been found
				this.isChecking = false;
			}
		});
	},

	updatePlayer: function () {
		if (!this.player.active) {
			return;
		}

		const speed = 200;

		if (this.gameState === 'playing') {
			if (this.cursors.left.isDown || this.wasdKeys.a.isDown) {
				this.player.setVelocity(-speed, 0);
				this.player.play('left-walk', true);
			} else if (this.cursors.right.isDown || this.wasdKeys.d.isDown) {
				this.player.setVelocity(speed, 0);
				this.player.play('right-walk', true);
			} else if (this.cursors.up.isDown || this.wasdKeys.w.isDown) {
				this.player.setVelocity(0, -speed);
				this.player.play('up-walk', true);
			} else if (this.cursors.down.isDown || this.wasdKeys.s.isDown) {
				this.player.setVelocity(0, speed);
				this.player.play('down-walk', true);
			} else {
				this.player.setVelocity(0, 0);
				const key = this.player.anims.currentAnim.key;
				const parts = key.split('-');
				const direction = parts[0];
				this.player.play(`${direction}-idle`);
			}

			const spaceJustPressed = Phaser.Input.Keyboard.JustUp(this.cursors.space);
			if (spaceJustPressed && this.activeBox) {
				this.openBox(this.activeBox);
			}
		}
	},

	updateActiveBox: function () {
		// if there is no active box or if a match is being checked for, return
		if (!this.activeBox || this.isChecking) {
			return;
		}

		const player = this.player;
		const box = this.activeBox;
		const distance = Phaser.Math.Distance.Between(
			player.x,
			player.y,
			box.x,
			box.y
		);

		// if player is too far away from the box, change color back to dark brown (box in frame 19 in spritesheet)
		if (distance < 64) {
			return;
		}
		box.setFrame(19);
		this.activeBox = undefined;
	},

	update: function () {
		// don't process player's input if game hasn't started
		if (this.gameState !== 'playing') {
			return;
		}
		this.updatePlayer();
		this.updateActiveBox();

		// depth sorting based on y position
		this.children.each((c) => {
			/** @type {Phaser.Physics.Arcade.Sprite} */
			const child = c;

			if (child.getData('sorted')) {
				return;
			}

			child.setDepth(child.y);
		});

		this.stopwatch.updateLabel();

		this.boxGroup.getChildren().forEach((box) => {
			const playerBounds = new Phaser.Geom.Rectangle(
				this.player.x,
				this.player.y,
				this.player.width,
				this.player.height / 2
			);
			const boxBounds = new Phaser.Geom.Rectangle(
				box.x,
				box.y,
				box.width,
				box.height / 2
			);
			if (
				Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, boxBounds)
			) {
				this.playerBoxCollision(this.player, box);
			}
		});
	},

	shutdown() {
		this.input.keyboard.removeAllListeners();
	},
});
