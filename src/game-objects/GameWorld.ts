import { Stick } from './Stick';
import { GameObject } from './GameObject';
import { Color } from '../common/Color';
import { Vector2 } from '../geom/Vector2';
import { GAME_CONFIG } from '../game.config';
import { Assets } from '../Assets';
import { Canvas2D } from '../Canvas';
import { Ball } from './Ball';
import { Mouse } from '../input/Mouse';

export class GameWorld implements GameObject {

    _stick: Stick;
    _redBalls: Ball[];
    _yellowBalls: Ball[];
    _cueBall: Ball;
    _8Ball: Ball;
    _balls: Ball[];

    constructor() {
        this._redBalls = GAME_CONFIG.RED_BALLS_POSITIONS
            .map((position: Vector2) => new Ball(Vector2.copy(position), Color.yellow));

        this._yellowBalls = GAME_CONFIG.YELLOW_BALLS_POSITIONS
            .map((position: Vector2) => new Ball(Vector2.copy(position), Color.red));

        this._cueBall = new Ball(Vector2.copy(GAME_CONFIG.CUE_BALL_POSITION), Color.white);
        this._8Ball = new Ball(Vector2.copy(GAME_CONFIG.EIGHT_BALL_POSITION), Color.black);

        this._stick = new Stick(Vector2.copy(GAME_CONFIG.CUE_BALL_POSITION));

        this._balls = [
            this._cueBall, 
            ...this._redBalls, 
            ... this._yellowBalls, 
            this._8Ball].sort((a: Ball, b: Ball) => {
            return a.position.x - b.position.x;
        });;

        console.log(this._balls);
    }

    private shootCueBall(): void {
        if(this._stick.power > 0) {
            this._stick.shoot();
            this._cueBall.shoot(this._stick.power, this._stick.rotation);
            this._stick.movable = false;
            setTimeout(() => this._stick.hide(), GAME_CONFIG.TIMEOUT_TO_HIDE_STICK_AFTER_SHOT);
        }
    }

    private handleInput(): void {
        if (Mouse.isPressed(GAME_CONFIG.SHOOT_MOUSE_BUTTON)) {
            this.shootCueBall();
        }
    }

    private handleCollisions(): void {
        for(let i = 0 ; i < this._balls.length ; i++ ){ 
            for(let j = i+1 ; j < this._balls.length ; j++ ){
                const firstBall = this._balls[i];
                const secondBall = this._balls[j];
                firstBall.collideWithBall(secondBall);
            }
        }    
    }

    private ballsMoving(): boolean {
        return this._balls.some(ball => ball.moving);
    }

    private nextTurn() {
        this._stick.relocate(this._cueBall.position);
    }

    public update(): void {
        this.handleCollisions();
        this.handleInput();
        this._stick.update();
        this._balls.forEach((ball: Ball) => ball.update());

        if(!this.ballsMoving() && !this._stick.visible) {
            this.nextTurn();
        }
    }

    public draw(): void {
        Canvas2D.drawImage(Assets.getSprite(GAME_CONFIG.SPRITES.TABLE));
        this._redBalls.forEach((ball: Ball) => ball.draw());
        this._yellowBalls.forEach((ball: Ball) => ball.draw());
        this._8Ball.draw();
        this._cueBall.draw();
        this._stick.draw();
    }
}