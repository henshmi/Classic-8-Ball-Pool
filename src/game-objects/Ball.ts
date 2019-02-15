import { GameObject } from './GameObject';
import { GAME_CONFIG } from './../game.config';
import { Canvas2D } from './../Canvas';
import { Color } from './../common/Color';
import { Vector2 } from './../geom/Vector2';
import { Assets } from '../Assets';

export class Ball implements GameObject {

    private _sprite: HTMLImageElement;
    private _velocity: Vector2 = Vector2.zero;
    private _moving: boolean = false;
    private _visible: boolean = true;


    protected get velocity(): Vector2 {
        return this._velocity;
    }

    protected set velocity(value: Vector2) {
        this._velocity = value;
    }

    public get position(): Vector2 {
        return Vector2.copy(this._position);
    }
    
    public set position(value: Vector2) {
        this._position = value;
    }

    public get moving(): boolean {
        return this._moving;
    }

    constructor(private _position: Vector2, color: Color) {
        this.resolveSprite(color);
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

    public collideWithBall(ball: Ball): void {

        if(!this._visible || !ball._visible){
            return;
        }
    
        // Find a normal vector
        const n: Vector2 = this._position.subtract(ball._position);
    
        // Find distance
        const dist: number = n.length;
    
        if(dist > GAME_CONFIG.BALL_DIAMETER){
            return;
        }
    
        // Find minimum translation distance
        const mtd = n.mult((GAME_CONFIG.BALL_DIAMETER - dist) / dist);
    
        // Push-pull balls apart
        this._position.addTo(mtd.mult(1/2));
        ball.position.subtractTo(mtd.mult(1/2));
    
        // Find unit normal vector
        const un = n.mult(1/n.length);
    
        // Find unit tangent vector
        const ut = new Vector2(-un.y, un.x);
    
        // Project velocities onto the unit normal and unit tangent vectors
        const v1n: number = un.dot(this._velocity);
        const v1t: number = ut.dot(this._velocity);
        const v2n: number = un.dot(ball.velocity);
        const v2t: number = ut.dot(ball.velocity);
    
        // Convert the scalar normal and tangential velocities into vectors
        const v1nTag: Vector2 = un.mult(v2n);
        const v1tTag: Vector2 = ut.mult(v1t);
        const v2nTag: Vector2 = un.mult(v1n);
        const v2tTag: Vector2 = ut.mult(v2t);
    
        // Update velocities
        this._velocity = v1nTag.add(v1tTag);
        ball.velocity = v2nTag.add(v2tTag);
    
        this._moving = true;
        ball._moving = true;
    }

    public shoot(power: number, angle: number): void {
        this._velocity = new Vector2(power * Math.cos(angle), power * Math.sin(angle));
        this._moving = true;
    }

    public update(): void {
        if(this._moving) {
            this._velocity.multBy(1 - GAME_CONFIG.FRICTION);
            this._position.addTo(this._velocity);

            if(this._velocity.length < GAME_CONFIG.BALL_MIN_VELOCITY_LENGTH) {
                this.velocity = Vector2.zero;
                this._moving = false;
            }
        }
    }

    public draw(): void {
        Canvas2D.drawImage(this._sprite, this._position, 0, GAME_CONFIG.BALL_ORIGIN);
    }
}