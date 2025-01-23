import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background', 'background.png');
    }

    create() {
        this.add.image(512, 384, 'background').setScale(0.5, 0.5);
    }
}
