import { Canvas2D } from './../Canvas';
import { Vector2 } from './../geom/Vector2';

export class MenuLabel {

    constructor(
        private _text: string,
        private _position: Vector2,
        private _font: string,
        private _color: string,
        private _alignment: string,
    ){}

    public draw(): void {
        Canvas2D.drawText(this._text, this._font, this._color, this._position, this._alignment);
    }
}