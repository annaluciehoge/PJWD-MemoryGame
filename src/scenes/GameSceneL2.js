// GameSceneL2 inherits from GameScene.js -> look in GameSceneL1 for more info on methods and properties
import GameScene from './GameSceneL1.js';

class GameSceneL2 extends GameScene {
	constructor() {
		super('GameSceneL2');
	}

	create() {
		this.currentLevel = 'level2';

		this.successMatchSound = this.sound.add('success-match-sound');
		this.winSound = this.sound.add('win-sound');
		this.chickSound = this.sound.add('chick-sound');
		this.chickenSound = this.sound.add('chicken-sound');
		this.cowSound = this.sound.add('cow-sound');
		this.ghostSound = this.sound.add('ghost-sound');
		this.goatSound = this.sound.add('goat-sound');
		this.horseSound = this.sound.add('horse-sound');
		this.owlSound = this.sound.add('owl-sound');
		this.pigSound = this.sound.add('pig-sound');
		this.highscoreSound = this.sound.add('highscore-sound');
		this.backgroundMusic = this.sound.add('background-music');

		// level layout for Level 2, is shuffled in each new round
		this.level = [
			[1, 0, 3, 6],
			[2, 4, 1, 0],
			[3, 4, 2, 7],
			[5, 5, 6, 7],
		];

		// recalculate totalBoxes and totalGhosts for Level 2
		this.totalBoxes = [].concat(...this.level).length;
		const ghosts = [].concat(...this.level).filter((item) => item === 0);
		this.totalGhosts = ghosts.length;

		// call parent class's create method
		super.create();
	}

	// override openBox method from parent class
	/**
	 *
	 * @param {Phaser.Physics.Arcade.Sprite} box
	 */
	openBox(box) {
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
				item.setTexture('pig');
				this.pigSound.play();
				break;
			case 5:
				item = this.itemsGroup.get(box.x, box.y);
				item.setTexture('horse');
				this.horseSound.play();
				break;
			case 6:
				item = this.itemsGroup.get(box.x, box.y);
				item.setTexture('cow');
				this.cowSound.play();
				break;
			case 7:
				item = this.itemsGroup.get(box.x, box.y);
				item.setTexture('goat');
				this.goatSound.play();
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
	}
}

export default GameSceneL2;
