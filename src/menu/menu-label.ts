import { IVector2 } from './../game.config.type';
import { Canvas2D } from '../canvas';
import { Vector2 } from '../geom/vector2';

export class MenuLabel {

    //------Constructor------//

    constructor(
        private _text: string,
        private _position: IVector2,
        private _font: string,
        private _color: string,
        private _alignment: string,
    ){}

    //------Public Methods------//

    public draw(): void {
        Canvas2D.drawText(this._text, this._font, this._color, this._position, this._alignment);
    }
}