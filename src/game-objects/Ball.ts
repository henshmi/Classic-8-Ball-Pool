import { GameObject } from './GameObject';
import { GAME_CONFIG } from './../game.config';
import { Canvas2D } from './../Canvas';
import { Color } from './../common/Color';
import { Vector2 } from './../geom/Vector2';
import { Assets } from '../Assets';

export class Ball implements GameObject {

    private _sprite: HTMLImageElement;
    private _velocity: Vector2;
    private _moving: boolean;

    constructor(private _position: Vector2, color: Color) {
        this.resolveSprite(color);
        this._velocity = Vector2.zero;
        this._moving = false;
    }

    private resolveSprite(color: Color) {
        switch(color) {
            case Color.white:
                this._sprite = Assets.getSprite(GAME_CONFIG.SPRITES.CUE_BALL);
                break;

            case Color.black:
                this._sprite = Assets.getSprite(GAME_CONFIG.SPRITES.BLACK_BALL);
                break;

            case Color.red:
                this._sprite = Assets.getSprite(GAME_CONFIG.SPRITES.RED_BALL);
                break;

            case Color.yellow:
                this._sprite = Assets.getSprite(GAME_CONFIG.SPRITES.YELLOW_BALL);
                break;
        }
    }

    public shoot(power: number, angle: number): void {
        this._velocity = new Vector2(power * Math.cos(angle), power * Math.sin(angle));
        this._moving = true;
    }

    public update(): void {
        this._position.addTo(this._velocity);
    }

    public draw(): void {
        Canvas2D.drawImage(this._sprite, this._position, 0, GAME_CONFIG.BALL_ORIGIN);
    }
}