export default class BackgroundScene extends Phaser.Scene {
	constructor() {
		super({ key: 'BackgroundScene' });
	}

	preload() {
		this.load.image('house', '../textures/house.png');
		this.load.image('cloud1', '../textures/cloud1.png');
		this.load.image('cloud2', '../textures/cloud2.png');
		this.load.image('cloud3', '../textures/cloud3.png');
		this.load.image('cloud4', '../textures/cloud4.png');
		this.load.image('cloud5', '../textures/cloud5.png');
		this.load.image('cloud6', '../textures/cloud6.png');
		this.load.image('tree1', '../textures/tree05.png');
		this.load.image('tree2', '../textures/tree23.png');
		this.load.image('tree3', '../textures/tree25.png');
		this.load.image('tree4', '../textures/tree27.png');
	}

	create() {
		const { width: sceneWidth, height: sceneHeight } = this.scale;

		// blue rectangle for the upper half of canvas to represent sky
		let upperRect = this.add.rectangle(
			sceneWidth / 2,
			sceneHeight / 20,
			sceneWidth,
			sceneHeight / 6,
			0x6699cc
		);
		upperRect.setOrigin(0.5, 0.5).setDepth(-1);

		// calculate y-coordinate of center of green rectangle
		let greenRectY =
			sceneHeight / 20 +
			sceneHeight / 6 / 2 +
			(sceneHeight - (sceneHeight / 20 + sceneHeight / 6 / 2)) / 2;

		// calculate height of green rectangle
		let greenRectHeight =
			sceneHeight - (sceneHeight / 20 + sceneHeight / 6 / 2);

		// green rectangle for the lower half of canvas to represent grass
		let lowerRect = this.add.rectangle(
			sceneWidth / 2,
			greenRectY,
			sceneWidth,
			greenRectHeight,
			0x66cc99
		);
		lowerRect.setOrigin(0.5, 0.5).setDepth(-1);

		// Add background images based on the upper bound of the green rectangle
		let greenRectUpperBound = greenRectY - greenRectHeight / 2;
		// y-position of background objects
		let objectY = greenRectUpperBound - 20;
		// x-coordinate of house and trees
		let houseX = sceneWidth - sceneWidth * 0.1; // 10% away from the right edge so that in all scenes (which have different widths) the house is not too far in the center
		let treeX = houseX - 60;

		this.add.image(houseX, objectY, 'house').setScale(0.5);
		this.add.image(50, objectY, 'tree1').setScale(0.25);
		this.add.image(25, objectY, 'tree2').setScale(0.25);
		this.add.image(120, objectY, 'tree3').setScale(0.25);
		this.add.image(140, objectY, 'tree4').setScale(0.25);
		this.add.image(165, objectY, 'tree1').setScale(0.25);
		this.add.image(treeX, objectY, 'tree4').setScale(0.25);

		const { width: sceneWidth1, height: sceneHeight2 } = this.scale;

		// clouds with randomized vertical starting position
		let cloud1 = this.add
			.image(sceneWidth1 + 40, Phaser.Math.Between(20, 50), 'cloud1')
			.setScale(0.25)
			.setDepth(-1);
		let cloud2 = this.add
			.image(sceneWidth1 + 40, Phaser.Math.Between(20, 50), 'cloud2')
			.setScale(0.25)
			.setDepth(-1);
		let cloud3 = this.add
			.image(sceneWidth1 + 40, Phaser.Math.Between(20, 50), 'cloud3')
			.setScale(0.25)
			.setDepth(-1);
		let cloud4 = this.add
			.image(sceneWidth1 + 40, Phaser.Math.Between(20, 50), 'cloud4')
			.setScale(0.25)
			.setDepth(-1);
		let cloud5 = this.add
			.image(sceneWidth1 + 40, Phaser.Math.Between(20, 50), 'cloud5')
			.setScale(0.25)
			.setDepth(-1);
		let cloud6 = this.add
			.image(sceneWidth1 + 40, Phaser.Math.Between(20, 50), 'cloud6')
			.setScale(0.25)
			.setDepth(-1);

		this.moveCloud(cloud1, Phaser.Math.Between(60000, 70000), 0); // random duration between 60 and 70 seconds for clouds to move across the screen
		this.moveCloud(cloud2, Phaser.Math.Between(60000, 70000), 9000);
		this.moveCloud(cloud3, Phaser.Math.Between(60000, 70000), 18000);
		this.moveCloud(cloud4, Phaser.Math.Between(60000, 70000), 27000);
		this.moveCloud(cloud5, Phaser.Math.Between(60000, 70000), 36000);
		this.moveCloud(cloud6, Phaser.Math.Between(60000, 70000), 45000);
	}

	moveCloud(cloud, movementDuration, delay) {
		this.tweens.add({
			targets: cloud,
			x: -cloud.width,
			duration: movementDuration,
			delay: delay,
			repeat: -1, // animation will repeat indefinitely so user realizes that screen is not frozen
			ease: 'Linear',
		});
	}
}
