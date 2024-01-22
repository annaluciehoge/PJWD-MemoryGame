export default class StopwatchController {
	/**
	 * @type {Phaser.Scene}
	 */
	scene;

	/**
	 * @type {Phaser.GameObjects.Text}
	 */
	label;

	/**
	 * @type {Phaser.Time.TimerEvent}
	 */
	timerEvent;

	/**
	 * @type {number}
	 */
	elapsedTime;

	/**
	 *
	 * @param {Phaser.Scene} scene
	 * @param {Phaser.GameObjects.Text} label
	 */
	constructor(scene, label) {
		this.scene = scene;
		this.label = label;
		this.elapsedTime = 0;
	}

	start() {
		this.stop();

		this.timerEvent = this.scene.time.addEvent({
			delay: 1000,
			callback: () => {
				this.elapsedTime += 1;
				this.updateLabel();
			},
			loop: true,
		});
	}

	stop() {
		if (this.timerEvent) {
			this.timerEvent.destroy();
			this.timerEvent = undefined;
		}
	}

	updateLabel() {
		const minutes = Math.floor(this.elapsedTime / 60);
		const seconds = this.elapsedTime - minutes * 60;

		this.label
			.setText(
				`${minutes.toString().padStart(2, '0')}:${seconds
					.toString()
					.padStart(2, '0')}`
			)
			.setShadow(2, 2, '#262626', 2);
	}
}
