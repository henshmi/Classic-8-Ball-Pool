import { GAME_CONFIG } from './../game.config';
import { Canvas2D } from './../Canvas';
import { Color } from './../common/Color';
import { Vector2 } from './../geom/Vector2';
import { Assets } from '../Assets';

export class Ball {

    private _color: Color;
    private _sprite: HTMLImageElement;
    private _velocity: Vector2 = Vector2.zero;
    private _moving: boolean = false;
    private _visible: boolean = true;


    protected get nextPosition(): Vector2 {
        return this._position.add(this._velocity.mult(1 - GAME_CONFIG.FRICTION));
    }

    protected get velocity(): Vector2 {
        return this._velocity;
    }

    protected set velocity(value: Vector2) {
        this._velocity = value;
    }

    public get position(): Vector2 {
        return Vector2.copy(this._position);
    }

    public get insidePocket(): boolean {
        return !this._visible && !this.moving;
    }
    
    public set position(value: Vector2) {
        this._position = value;
    }

    public get moving(): boolean {
        return this._moving;
    }

    public get color() {
        return this._color;
    }

    constructor(private _position: Vector2, color: Color) {
        this._color = color;
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

    private handleBallInPocket(): void {

        const inPocket: boolean = GAME_CONFIG.POCKETS_POSITIONS
            .some((pocketPos: Vector2) => this._position.distFrom(pocketPos) <= GAME_CONFIG.POCKET_RADIUS);

        if(inPocket) {
            this._velocity = Vector2.zero;
            this._moving = false;
            this._visible = false;
        }
        
    }

    private handleCollisionWithCushion(): void {

        const ballRadius: number = GAME_CONFIG.BALL_DIAMETER / 2;
        const topBallEdge: number = this.nextPosition.y - ballRadius;
        const leftBallEdge: number = this.nextPosition.x - ballRadius;
        const rightBallEdge: number = this.nextPosition.x + ballRadius;
        const bottomBallEdge: number = this.nextPosition.y + ballRadius;

        let collided: boolean = false;

        if(topBallEdge <= GAME_CONFIG.CUSHION_WIDTH) {
            this._position.addToY(GAME_CONFIG.CUSHION_WIDTH - this._position.y + ballRadius);
            this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
            collided = true;
        }
        if(leftBallEdge <= GAME_CONFIG.CUSHION_WIDTH) {
            this._position.addToX(GAME_CONFIG.CUSHION_WIDTH - this._position.x + ballRadius);
            this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
            collided = true;
        }
        if(rightBallEdge >= GAME_CONFIG.GAME_WIDTH - GAME_CONFIG.CUSHION_WIDTH) {
            this._position.addToX(GAME_CONFIG.GAME_WIDTH - GAME_CONFIG.CUSHION_WIDTH - this._position.x - ballRadius);
            this.velocity = new Vector2(-this.velocity.x, this.velocity.y);
            collided = true;
        }
        if(bottomBallEdge >= GAME_CONFIG.GAME_HEIGHT - GAME_CONFIG.CUSHION_WIDTH) {
            this._position.addToY(GAME_CONFIG.GAME_HEIGHT - GAME_CONFIG.CUSHION_WIDTH - this._position.y - ballRadius);
            this.velocity = new Vector2(this.velocity.x, -this.velocity.y);
            collided = true;
        }

        if(collided) {
            this._velocity.multBy(1 - GAME_CONFIG.COLLISION_LOSS);
        }
    }

    public collideWithBall(ball: Ball): boolean {

        if(!this._visible || !ball._visible){
            return false;
        }
    
        // Find a normal vector
        const n: Vector2 = this._position.subtract(ball._position);
    
        // Find distance
        const dist: number = n.length;
    
        if(dist > GAME_CONFIG.BALL_DIAMETER){
            return false;
        }
    
        // Find minimum translation distance
        const mtd = n.mult((GAME_CONFIG.BALL_DIAMETER - dist) / dist);
    
        // Push-pull balls apart
        this._position.addTo(mtd.mult(0.5));
        ball.position = ball.position.subtract(mtd.mult(0.5));
    
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

        this.velocity.multBy(1 - GAME_CONFIG.COLLISION_LOSS);
        ball.velocity = ball.velocity.mult(1 - GAME_CONFIG.COLLISION_LOSS);
        
        return true;
    }

    public shoot(power: number, angle: number): void {
        this._velocity = new Vector2(power * Math.cos(angle), power * Math.sin(angle));
        this._moving = true;
    }

    public relocate(position: Vector2): void {
        this._position = position;
        this._velocity = Vector2.zero;
        this._visible = true;
    }

    public update(): void {
        if(this._moving) {
            this.handleBallInPocket();
            this.handleCollisionWithCushion();
            this._velocity.multBy(1 - GAME_CONFIG.FRICTION);
            this._position.addTo(this._velocity);

            if(this._velocity.length < GAME_CONFIG.BALL_MIN_VELOCITY_LENGTH) {
                this.velocity = Vector2.zero;
                this._moving = false;
            }
        }
    }

    public draw(): void {
        if(this._visible){
            Canvas2D.drawImage(this._sprite, this._position, 0, GAME_CONFIG.BALL_ORIGIN);
        }
    }
}