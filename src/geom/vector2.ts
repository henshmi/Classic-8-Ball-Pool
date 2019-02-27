import { IVector2 } from '../game.config.type';

export class Vector2 implements IVector2 {

    //------Members------//

    private _x: number;
    private _y: number;

    //------Constructor------//

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    //------Properties------//

    get x() {
        return this._x;
    }
    
    get y() {
        return this._y;
    }

    static get zero() {
        return new Vector2(0, 0);
    }

    get length(): number {
        return Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2));
    }

    //------Public Methods------//

    public static copy(vector: IVector2) {
        return new Vector2(vector.x, vector.y);
    }

    public addX(x: number): Vector2 {
        return new Vector2(this._x, this._y).addToX(x);
    }

    public addY(y: number): Vector2 {
        return new Vector2(this._x, this._y).addToY(y);
    }

    public addToX(x: number): Vector2 {
        this._x += x;
        return this;
    }

    public addToY(y: number): Vector2 {
        this._y += y;
        return this;
    }

    public addTo(vector: Vector2): Vector2 {
        return this.addToX(vector.x).addToY(vector.y);
    }

    public add(vector: Vector2): Vector2 {
        return new Vector2(this._x, this._y).addTo(vector);
    }

    public subtractTo(vector: Vector2): Vector2 {
        this._x -= vector.x;
        this._y -= vector.y;
        return this;
    }

    public subtract(vector: Vector2): Vector2 {
        return new Vector2(this._x, this._y).subtractTo(vector);
    }

    public mult(v: number): Vector2 {
        return new Vector2(this._x, this._y).multBy(v);
    }

    public multBy(v: number): Vector2 {
        this._x *= v;
        this._y *= v;
        return this;
    }

    public dot(vector: Vector2): number {
        return this._x * vector.x + this._y * vector.y;
    }

    public distFrom(vector: Vector2): number {
        return this.subtract(vector).length;
    }
}