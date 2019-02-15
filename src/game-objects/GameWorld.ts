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

    constructor() {
        this._redBalls = GAME_CONFIG.RED_BALLS_POSITIONS
            .map((position: Vector2) => new Ball(Vector2.copy(position), Color.yellow));

        this._yellowBalls = GAME_CONFIG.YELLOW_BALLS_POSITIONS
            .map((position: Vector2) => new Ball(Vector2.copy(position), Color.red));

        this._cueBall = new Ball(Vector2.copy(GAME_CONFIG.CUE_BALL_POSITION), Color.white);
        this._8Ball = new Ball(Vector2.copy(GAME_CONFIG.EIGHT_BALL_POSITION), Color.black);

        this._stick = new Stick(Vector2.copy(GAME_CONFIG.CUE_BALL_POSITION));
    }

    public handleInput() {
        if (Mouse.isPressed(GAME_CONFIG.SHOOT_MOUSE_BUTTON)) {
            this._cueBall.shoot(this._stick.distance, this._stick.rotation);
        }
    }

    public update(): void {
        this.handleInput();
        this._stick.update();
        this._cueBall.update();
        this._redBalls.forEach((ball: Ball) => ball.update());
        this._yellowBalls.forEach((ball: Ball) => ball.update());
        this._8Ball.update();
    }

    public draw(): void {
        Canvas2D.drawImage(Assets.getSprite(GAME_CONFIG.SPRITES.TABLE));
        this._redBalls.forEach((ball: Ball) => ball.draw());
        this._yellowBalls.forEach((ball: Ball) => ball.draw());
        this._cueBall.draw();
        this._8Ball.draw();
        this._stick.draw();
    }
}