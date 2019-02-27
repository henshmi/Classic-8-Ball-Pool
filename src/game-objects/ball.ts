import { IBallConfig, IPhysicsConfig, IAssetsConfig } from './../game.config.type';
import { GameConfig } from '../game.config';
import { Canvas2D } from '../canvas';
import { Color } from '../common/color';
import { Vector2 } from '../geom/vector2';
import { Assets } from '../assets';

const physicsConfig: IPhysicsConfig = GameConfig.physics;
const sprites: IAssetsConfig = GameConfig.sprites;
const ballConfig: IBallConfig = GameConfig.ball;

export class Ball {

    //------Members------//

    private _sprite: HTMLImageElement;
    private _color: Color;
    private _velocity: Vector2 = Vector2.zero;
    private _moving: boolean = false;
    private _visible: boolean = true;


    //------Properties------//

    public get position(): Vector2 {
        return Vector2.copy(this._position);
    }

    public set position(value: Vector2) {
        this._position = value;
    }

    public get nextPosition(): Vector2 {
        return this.position.add(this._velocity.mult(1 - physicsConfig.friction));
    }

    public get velocity(): Vector2 {
        return Vector2.copy(this._velocity);
    }

    public set velocity(value: Vector2) {
        this._moving = value.length > 0 ? true : false;
        this._velocity = value;
    }

    public get moving(): boolean {
        return this._moving;
    }

    public get color(): Color {
        return this._color;
    }

    public get visible(): boolean {
        return this._visible;
    }

    //------Constructor------//

    constructor(private _position: Vector2, color: Color) {
        this._color = color;
        this.resolveSprite(color);
    }

    //------Private Methods------//

    private resolveSprite(color: Color) {
        switch(color) {
            case Color.white:
                this._sprite = Assets.getSprite(sprites.paths.cueBall);
                break;

            case Color.black:
                this._sprite = Assets.getSprite(sprites.paths.blackBall);
                break;

            case Color.red:
                this._sprite = Assets.getSprite(sprites.paths.redBall);
                break;

            case Color.yellow:
                this._sprite = Assets.getSprite(sprites.paths.yellowBall);
                break;
        }
    }

    //------Public Methods------//

    public shoot(power: number, angle: number): void {
        this._velocity = new Vector2(power * Math.cos(angle), power * Math.sin(angle));
        this._moving = true;
    }

    public show(position: Vector2): void {
        this._position = position;
        this._velocity = Vector2.zero;
        this._visible = true;
    }

    public hide(): void {
        this._velocity = Vector2.zero;
        this._moving = false;
        this._visible = false;
    }

    public update(): void {
        if(this._moving) {
            this._velocity.multBy(1 - physicsConfig.friction);
            this._position.addTo(this._velocity);

            if(this._velocity.length < ballConfig.minVelocityLength) {
                this.velocity = Vector2.zero;
                this._moving = false;
            }
        }
    }

    public draw(): void {
        if(this._visible){
            Canvas2D.drawImage(this._sprite, this._position, 0, ballConfig.origin);
        }
    }
}