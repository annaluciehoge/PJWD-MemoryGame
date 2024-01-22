import Phaser from 'phaser';

export default new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function PreloadScene() {
		Phaser.Scene.call(this, { key: 'PreloadScene' });
	},

	preload: function () {
		this.load.spritesheet('sokoban', '../textures/sokoban_tilesheet.png', {
			frameWidth: 64,
		});

		this.load.image('ghost', '../textures/ghost.png');
		this.load.image('chick', '../textures/chick.png');
		this.load.image('chicken', '../textures/chicken.png');
		this.load.image('owl', '../textures/owl.png');
		this.load.image('penguin', '../textures/penguin.png');
		this.load.image('pig', '../textures/pig.png');
		this.load.image('horse', '../textures/horse.png');
		this.load.image('cow', '../textures/cow.png');
		this.load.image('goat', '../textures/goat.png');
		this.load.svg('restartIcon', '../textures/repeat.svg');

		this.load.audio('background-music', '../sounds/background_music.mp3');
		this.load.audio('chick-sound', '../sounds/chick.mp3');
		this.load.audio('chicken-sound', '../sounds/chicken.mp3');
		this.load.audio('cow-sound', '../sounds/cow.mp3');
		this.load.audio('ghost-sound', '../sounds/ghost.mp3');
		this.load.audio('goat-sound', '../sounds/goat.mp3');
		this.load.audio('horse-sound', '../sounds/horse.mp3');
		this.load.audio('owl-sound', '../sounds/owl.mp3');
		this.load.audio('pig-sound', '../sounds/pig.mp3');
		this.load.audio('penguin-sound', '../sounds/penguin.mp3');
		this.load.audio('highscore-sound', '../sounds/highscore.mp3');
		this.load.audio('win-sound', '../sounds/win.mp3');
		this.load.audio('success-match-sound', '../sounds/success_match.mp3');
	},

	create: function () {
		// animations for player movement
		// if statements are used to prevent redefinition of animations (not having them led to warnings in the console)
		// down idle animation
		if (!this.anims.exists('down-idle')) {
			this.anims.create({
				key: 'down-idle',
				frames: [{ key: 'sokoban', frame: 65 }],
				frameRate: 10,
			});
		}
		// down walk animation
		if (!this.anims.exists('down-walk')) {
			this.anims.create({
				key: 'down-walk',
				frames: this.anims.generateFrameNumbers('sokoban', {
					start: 65,
					end: 67,
				}),
				frameRate: 10,
				repeat: -1,
			});
		}
		// up idle animation
		if (!this.anims.exists('up-idle')) {
			this.anims.create({
				key: 'up-idle',
				frames: [{ key: 'sokoban', frame: 68 }],
				frameRate: 10,
			});
		}
		// up walk animation
		if (!this.anims.exists('up-walk')) {
			this.anims.create({
				key: 'up-walk',
				frames: this.anims.generateFrameNumbers('sokoban', {
					start: 68,
					end: 70,
				}),
				frameRate: 10,
				repeat: -1,
			});
		}
		// left idle animation
		if (!this.anims.exists('left-idle')) {
			this.anims.create({
				key: 'left-idle',
				frames: [{ key: 'sokoban', frame: 94 }],
				frameRate: 10,
			});
		}
		// left walk animation
		if (!this.anims.exists('left-walk')) {
			this.anims.create({
				key: 'left-walk',
				frames: this.anims.generateFrameNumbers('sokoban', {
					start: 94,
					end: 96,
				}),
				frameRate: 10,
				repeat: -1,
			});
		}
		// right idle animation
		if (!this.anims.exists('right-idle')) {
			this.anims.create({
				key: 'right-idle',
				frames: [{ key: 'sokoban', frame: 91 }],
				frameRate: 10,
			});
		}
		// right walk animation
		if (!this.anims.exists('right-walk')) {
			this.anims.create({
				key: 'right-walk',
				frames: this.anims.generateFrameNumbers('sokoban', {
					start: 91,
					end: 93,
				}),
				frameRate: 10,
				repeat: -1,
			});
		}

		// switch to GameScene when assets are loaded
		this.scene.start('GameScene');
	},
});
