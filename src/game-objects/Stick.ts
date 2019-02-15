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
    private _power: number = 0;
    private _movable: boolean = true;
    private _visible: boolean = true;

    public get rotation(): number {
        return this._rotation;
    }

    public get power(): number {
        return this._power;
    }

    public set movable(value: boolean) {
        this._movable = value;
    }

    public get visible(): boolean {
        return this._visible;
    }

    constructor(private _position: Vector2) {
        this._sprite = Assets.getSprite(GAME_CONFIG.SPRITES.STICK);
        this._origin = Vector2.copy(GAME_CONFIG.STICK_ORIGIN);
    }

    private increasePower(): void {
        this._power++;
        this._origin.addToX(GAME_CONFIG.STICK_MOVEMENT_PER_FRAME);
    }

    private decreasePower(): void {
        this._power--;
        this._origin.addToX(-GAME_CONFIG.STICK_MOVEMENT_PER_FRAME);
    }
    
    private isLessThanMaxDistance(): boolean {
        return this._power <= GAME_CONFIG.STICK_MAX_POWER;
    }

    private isMoreThanMinDistance(): boolean {
        return this._power >= 0;
    }

    private updateDistance(): void {

        if (Keyboard.isDown(GAME_CONFIG.INCREASE_SHOT_POWER_KEY) && this.isLessThanMaxDistance()) {
            this.increasePower();
        }
        else if (Keyboard.isDown(GAME_CONFIG.DECREASE_SHOT_POWER_KEY) && this.isMoreThanMinDistance()) {
            this.decreasePower();
        }
    }

    private updateRotation(): void {
        const opposite: number = Mouse.posY - this._position.y;
        const adjacent: number = Mouse.posX - this._position.x;
        this._rotation = Math.atan2(opposite, adjacent);
    }

    public hide(): void {
        this._power = 0;
        this._visible = false;
    }

    public shoot(): void {
        this._origin = Vector2.copy(GAME_CONFIG.STICK_SHOT_ORIGIN);
    }

    public relocate(position: Vector2): void {
        this._position = position;
        this._origin = Vector2.copy(GAME_CONFIG.STICK_ORIGIN);
        this._movable = true;
        this._visible = true;
    }

    public update(): void {
        if(this._movable) {
            this.updateRotation();
            this.updateDistance();
        }
    }

    public draw(): void {
        if(this._visible) {
            Canvas2D.drawImage(this._sprite, this._position, this._rotation, this._origin);
        }
    }

}