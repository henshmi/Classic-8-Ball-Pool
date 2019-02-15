import { Keyboard } from './../input/Keyboard';
import { Mouse } from './../input/Mouse';
import { GAME_CONFIG } from './../game.config';
import { Assets } from './../Assets';
import { Canvas2D } from './../Canvas';
import { Vector2 } from './../geom/Vector2';
import { GameObject } from './GameObject';

export class Stick implements GameObject {

    private _sprite: HTMLImageElement;
    private _rotation: number;
    private _origin: Vector2;
    private _distance: number = 0;

    public get rotation() {
        return this._rotation;
    }

    public get distance() {
        return this._distance;
    }

    constructor(private _position: Vector2) {
        this._sprite = Assets.getSprite(GAME_CONFIG.SPRITES.STICK);
        this._origin = Vector2.copy(GAME_CONFIG.STICK_ORIGIN);
    }

    private increaseDistance(): void {
        this._distance += GAME_CONFIG.STICK_MOVEMENT_PER_FRAME;
        this._origin.addToX(GAME_CONFIG.STICK_MOVEMENT_PER_FRAME);
    }

    private decreaseDistance(): void {
        this._distance -= GAME_CONFIG.STICK_MOVEMENT_PER_FRAME;
        this._origin.addToX(-GAME_CONFIG.STICK_MOVEMENT_PER_FRAME);
    }
    
    private isLessThanMaxDistance(): boolean {
        return this._distance < GAME_CONFIG.STICK_MAX_DISTANCE;
    }

    private isMoreThanMinDistance(): boolean {
        return this._distance >= 0;
    }

    private updateDistance(): void {

        if (Keyboard.isDown(GAME_CONFIG.INCREASE_SHOT_POWER_KEY) && this.isLessThanMaxDistance()) {
            this.increaseDistance();
        }
        else if (Keyboard.isDown(GAME_CONFIG.DECREASE_SHOT_POWER_KEY) && this.isMoreThanMinDistance()) {
            this.decreaseDistance();
        }
    }

    private updateRotation(): void {
        const opposite: number = Mouse.posY - this._position.y;
        const adjacent: number = Mouse.posX - this._position.x;
        this._rotation = Math.atan2(opposite, adjacent);
    }

    public update(): void {
        this.updateRotation();
        this.updateDistance();
    }

    public draw(): void {
        Canvas2D.drawImage(this._sprite, this._position, this._rotation, this._origin);
    }

}