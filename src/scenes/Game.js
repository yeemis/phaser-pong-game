import { Scene } from 'phaser';

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
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background', 'background.png');
        this.load.image('ball', 'ball.png');
        this.load.image('paddle', 'paddle.png');
    }

    create() {
        this.add.image(512, 384, 'background').setScale(0.8, 0.8);
        this.ball = this.physics.add.image(512, 384, 'ball').setScale(0.05, 0.05).refreshBody();
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1, 1);

        this.leftPaddle = this.physics.add.image(50, 384, "paddle");
        this.leftPaddle.setImmovable(true);

        this.rightPaddle = this.physics.add.image(974, 384, "paddle");
        this.rightPaddle.setImmovable(true);

        this.physics.add.collider(this.ball, this.leftPaddle, this.hitPaddle, null, this);
        this.physics.add.collider(this.ball, this.rightPaddle, this.hitPaddle, null, this);

        this.leftScoreText = this.add.text(100, 50, '0', { fontSize: '32px', fill: '#fff' });
        this.rightScoreText = this.add.text(924, 50, '0', { fontSize: '32px', fill: '#fff' });

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
        } else if (this.ball.x > 1024-margin) {
            this.leftScore += 1;
            this.leftScoreText.setText(this.leftScore);
            this.resetBall();
        }

        this.leftPaddle.body.updateFromGameObject();
        this.rightPaddle.body.updateFromGameObject();
    }

    startBall() {
        this.ball.setVelocity(200, 200);
    }

    resetBall() {
        this.ball.setPosition(512, 384);
        this.ball.setVelocity(0, 0);
        this.time.delayedCall(1000, this.startBall, [], this);
    }

    hitPaddle(ball, paddle) {
        let velocityIncrease = 100;
        let newVelocityX = ball.body.velocity.x + (ball.body.velocity.x > 0 ? velocityIncrease : -velocityIncrease);
        let newVelocityY = ball.body.velocity.y + (ball.body.velocity.y > 0 ? velocityIncrease : -velocityIncrease);

        ball.setVelocity(newVelocityX, newVelocityY);
    }
}