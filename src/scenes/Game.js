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
        this.leftscore = 0;
        this.rightscore = 0;
        this.leftscoretext = null;
        this.rightscoretext = null;
        this.paddleSpeed = 5;
    }

    preload() {
        this.load.image('background','assets/background.png');
        this.load.image('ball','assets/ball.png');
        this.load.image('paddle','assets/paddle.png');
        this.load.image('speedup','assets/speedup.png');
        this.load.image('slowdown','assets/slowdown.png');
    }

    create() {
        this.add.image(WIDTH/2,HEIGHT/2,'background').setScale(0.8,0.8);
        this.ball = this.physics.add.image(WIDTH/2,HEIGHT/2,'ball').setScale(0.05,0.05).refreshBody();
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1,1);
        this.ball.setVelocity(200,200);
        this.leftPaddle = this.physics.add.image(50,382,'paddle');
        this.leftPaddle.setImmovable(true);
        this.physics.add.collider(this.ball, this.leftPaddle,this.hitPaddle,null,this);
        this.rightPaddle = this.physics.add.image(974,384,"paddle");
        this.rightPaddle.setImmovable(true);
        this.physics.add.collider(this.ball, this.rightPaddle,this.hitPaddle,null,this);
        this.input.keyboard.on('keydown-SPACE', this.startball, this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S
        });
        this.leftscoretext = this.add.text(100,50,'0',{fontSize: '50px'});
        this.rightscoretext = this.add.text(900,50,'0',{fontSize: '50px'});
        this.powerups = this.physics.add.group();

        this.physics.add.overlap(this.leftPaddle, this.powerups, this.collectPowerup, null, this);
        this.physics.add.overlap(this.rightPaddle, this.powerups, this.collectPowerup, null, this);

        this.time.addEvent({
            delay: 50,
            callback: this.spawnPowerup,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if(this.wasd.up.isDown && this.leftPaddle.y > 0){
            this.leftPaddle.y -= this.paddleSpeed;
        }else if(this.wasd.down.isDown &&this.leftPaddle.y < HEIGHT){
            this.leftPaddle.y += this.paddleSpeed;
        }


        if(this.cursors.up.isDown && this.rightPaddle.y > 0){
            this.rightPaddle.y -= this.paddleSpeed;
        }else if(this.cursors.down.isDown && this.rightPaddle.y < HEIGHT){
            this.rightPaddle.y += this.paddleSpeed;
        }
        const margin = 30;
        if (this.ball.x < margin){
            this.rightscore += 1;
            this.rightscoretext.setText(this.rightscore);
            this.resetBall();
        }else if (this.ball.x > WIDTH - margin) {
            this.leftscore += 1;
            this.leftscoretext.setText(this.leftscore);
            this.resetBall();
        }
        
    }
    startball() {
        if (!this.ballInMotion) {
            let initialVelocityX = 200 * (Phaser.Math.Between(0,1)? 1 : -1);
            let initialVelocityY = 200 * (Phaser.Math.Between(0,1)? 1 : -1);
            this.ball.setVelocity(initialVelocityX, initialVelocityY);
            this.ballInMotion = true;
        }
    }
    hitPaddle(ball, paddle) {
        let velocityFactor = 1.3;
        let newVelocityX = ball.body.velocity.x * velocityFactor;
        let newVelocityY = ball.body.velocity.y * velocityFactor;
        let angleDeviationinDEG = Phaser.Math.Between(-30, 30);
        let angleInRadians = Phaser.Math.DegToRad(angleDeviationinDEG);
        let newVelocity = new Phaser.Math.Vector2(newVelocityX, newVelocityY).rotate(angleInRadians); 
        ball.setVelocity(newVelocity.x, newVelocity.y);
    }
    resetBall(){
        this.ball.setPosition(WIDTH/2, 384);
        this.ball.setVelocity(0, 0);
        this.ballInMotion = false;
        this.startball()
    }
    spawnPowerup() {
        const types = ['speedup', 'powerup_slow', 'powerup_score'];
        const type = Phaser.Utils.Array.GetRandom(types);
        const x = Phaser.Math.Between(50 || 200);
        const y = Phaser.Math.Between(0, 668);
        this.powerups.create(x, y, type).setScale(0.05, 0.05);
    }
    collectPowerup(paddle, powerup) {
        if (powerup.texture.key === 'speedup') {
            // Speed up paddles for 5 seconds
            this.paddleSpeed = 10;
            this.time.delayedCall(5000, () => { this.paddleSpeed = 5; });
        } else if (powerup.texture.key === 'powerup_slow') {
            // Slow down ball for 5 seconds
            this.ball.setVelocity(this.ball.body.velocity.x * 0.5, this.ball.body.velocity.y * 0.5);
            this.time.delayedCall(5000, () => {
                this.ball.setVelocity(this.ball.body.velocity.x * 2, this.ball.body.velocity.y * 2);
            });
        } else if (powerup.texture.key === 'powerup_score') {
            // Give free score to the paddle that collected it
            if (paddle === this.leftPaddle) {
                this.leftscore += 1;
                this.leftscoretext.setText(this.leftscore);
            } else if (paddle === this.rightPaddle) {
                this.rightscore += 1;
                this.rightscoretext.setText(this.rightscore);
            }
        }
        powerup.destroy();
    }

}