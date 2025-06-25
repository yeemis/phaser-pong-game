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
    }

    update() {
        if(this.wasd.up.isDown && this.leftPaddle.y > 0){
            this.leftPaddle.y -= 5;
        }else if(this.wasd.down.isDown &&this.leftPaddle.y < HEIGHT){
            this.leftPaddle.y += 5;
        }


        if(this.cursors.up.isDown && this.rightPaddle.y > 0){
            this.rightPaddle.y -= 5;
        }else if(this.cursors.down.isDown && this.rightPaddle.y < HEIGHT){
            this.rightPaddle.y += 5;
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
        
        
    }
    resetBall(){
        this.ball.setPosition(WIDTH/2, 384);
        this.ball.setVelocity(0, 0);
        this.ballInMotion = false;
        this.startball()
    }

}