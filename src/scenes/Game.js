import { Scene } from 'phaser';

const WIDTH = 1024;
const HEIGHT = 768;

export class Game extends Scene {
    constructor() {
        super('Game');
        this.ball = null;
        this.leftPaddle = null;
        this.rightPaddle = null;
        this.ballInMotion = false;
        this.cursors = null;
        this.wasd = null;
    }

    preload() {
        this.load.image('background','assets/background.png');
        this.load.image('ball','assets/ball.png');
        this.load.image('paddle','assets/paddle.png');
    }

    create() {
        this.add.image(WIDTH/2,HEIGHT/2,'background').setScale(0.8,0.8);
        this.ball = this.physics.add.image(WIDTH/2,HEIGHT/2,'ball').setScale(0.05,0.05).refreshBody();
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1,1);
        this.ball.setVelocity(200,200);
        this.leftPaddle = this.add.image(50,382,'paddle');
        this.rightPaddle = this.add.image(974,384,"paddle");
        this.input.keyboard.on('keydown-SPACE', this.startball, this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addkeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
        });
        if(this.wasd.up.isDown){
            this.leftPaddle.y -= 5;
        }else if(this.wasd.down.isDown){
            this.leftPaddle.y += 5;
        }
        if(this.cursors.up.isDown){
            this.rightPaddle.y -= 5;
        }else if(this.cursors.down.isDown){
            this.rightPaddle.y += 5;
        }
    }

    update() {
        
    }
    startball() {
        if (!this.ballInMotion) {
            let initialVelocityX = 200 * (Phaser.Math.Between(0,1)? 1 : -1);
            let initialVelocityY = 200 * (Phaser.Math.Between(0,1)? 1 : -1);
            this.ball.setVelocity(initialVelocityX, initialVelocityY);
            this.ballInMotion = true;
        }
    }

}