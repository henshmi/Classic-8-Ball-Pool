
export class Vector2 {

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

    //------Public Methods------//

    public static copy(vector: Vector2) {
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

    public add(x : number, y: number): Vector2{
        this.addToX(x);
        this.addToY(y);
        return this;
    }
}