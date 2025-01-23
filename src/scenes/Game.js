import { Scene } from 'phaser';

const WIDTH = 1024;
const HEIGHT = 768;

export class Game extends Scene {
    constructor() {
        super('Game');
        this.ball = null;
        this.cursors = null;
        this.leftPaddle = null;
        this.rightPaddle = null;
        this.wasd = null;
        this.leftScore = 0;
        this.rightScore = 0;
        this.ballInMotion = false;
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background', 'background.png');
        this.load.image('ball', 'ball.png');
        this.load.image('paddle', 'paddle.png');
    }

    create() {
        this.add.image(WIDTH/2, HEIGHT/2, 'background').setScale(0.8, 0.8);
        this.ball = this.physics.add.image(WIDTH/2, HEIGHT/2, 'ball').setScale(0.05, 0.05).refreshBody();
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1, 1);

        this.leftPaddle = this.physics.add.image(50, 384, "paddle");
        this.leftPaddle.setImmovable(true);

        this.rightPaddle = this.physics.add.image(974, 384, "paddle");
        this.rightPaddle.setImmovable(true);

        this.physics.add.collider(this.ball, this.leftPaddle, this.hitPaddle, null, this);
        this.physics.add.collider(this.ball, this.rightPaddle, this.hitPaddle, null, this);

        this.leftScoreText = this.add.text(100, 50, '0', { fontSize: '50px', fontFamily: 'Courier New', fill: '#fff' });
        this.rightScoreText = this.add.text(924, 50, '0', { fontSize: '50px', fontFamily: 'Courier New', fill: '#fff' });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({ 
            up: Phaser.Input.Keyboard.KeyCodes.W, 
            down: Phaser.Input.Keyboard.KeyCodes.S 
        });

        this.input.keyboard.on('keydown-SPACE', this.startBall, this);
    }

    update() {
        if (this.wasd.up.isDown && this.leftPaddle.y > this.leftPaddle.height / 2) {
            this.leftPaddle.y -= 5;
        } else if (this.wasd.down.isDown && this.leftPaddle.y < 768 - this.leftPaddle.height / 2) {
            this.leftPaddle.y += 5;
        }

        if (this.cursors.up.isDown && this.rightPaddle.y > this.rightPaddle.height / 2) {
            this.rightPaddle.y -= 5;
        } else if (this.cursors.down.isDown && this.rightPaddle.y < 768 - this.rightPaddle.height / 2) {
            this.rightPaddle.y += 5;
        }

        const margin = 30;
        if (this.ball.x < margin) {
            this.rightScore += 1;
            this.rightScoreText.setText(this.rightScore);
            this.resetBall();
        } else if (this.ball.x > WIDTH - margin) {
            this.leftScore += 1;
            this.leftScoreText.setText(this.leftScore);
            this.resetBall();
        }

        this.leftPaddle.body.updateFromGameObject();
        this.rightPaddle.body.updateFromGameObject();
    }

    startBall() {
        if (!this.ballInMotion) {
            let initialVelocityX = 300 * (Phaser.Math.Between(0, 1) ? 1 : -1);
            let initialVelocityY = 300 * (Phaser.Math.Between(0, 1) ? 1 : -1);
            this.ball.setVelocity(initialVelocityX, initialVelocityY);
            this.ballInMotion = true;
        }
    }

    resetBall() {
        this.ball.setPosition(WIDTH/2, 384);
        this.ball.setVelocity(0, 0);
        this.ballInMotion = false;
        this.time.delayedCall(1000, this.startBall, [], this);
    }

    hitPaddle(ball, paddle) {
        let velocityFactor = 1.3;
        let newVelocityX = ball.body.velocity.x * velocityFactor;
        let newVelocityY = ball.body.velocity.y * velocityFactor;

        let angleDeviation = Phaser.Math.Between(Math.PI / 20, Math.PI / 20);
        let newVelocity = new Phaser.Math.Vector2(newVelocityX, newVelocityY).rotate(angleDeviation);

        ball.setVelocity(newVelocity.x, newVelocity.y);
    }
}