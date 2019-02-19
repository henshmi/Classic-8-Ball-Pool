import { GAME_CONFIG } from './../game.config';
import { Mouse } from './../input/Mouse';
import { Canvas2D } from './../Canvas';
import { Vector2 } from './../geom/Vector2';

export class MenuButton {

    private _activeSprite: HTMLImageElement;
    private _hovered: boolean;

    private set hovered(value: boolean) {
        this._hovered = value;
        this._activeSprite = value ? this._spriteOnHover : this._sprite;
    }

    constructor(
        private _callback: () => void,
        private _position: Vector2, 
        private _sprite: HTMLImageElement, 
        private _spriteOnHover: HTMLImageElement
    ) {
        this._activeSprite = this._sprite;
    }

    private isInsideButton(position: Vector2) {
        return position.x > this._position.x &&
               position.x < this._position.x + this._sprite.width &&
               position.y > this._position.y &&
               position.y < this._position.y + this._sprite.height;
    }


    public handleInput() {
        this.hovered = this.isInsideButton(Mouse.position);

        if(this._hovered && Mouse.isPressed(GAME_CONFIG.SELECT_MOUSE_BUTTON)) {
            Canvas2D.changeCursor(GAME_CONFIG.DEFAULT_CURSOR);
            this._callback();
        }
    }

    public update(): void {
        this.handleInput();
    }

    public draw(): void {
        if(this._hovered) {
            Canvas2D.changeCursor(GAME_CONFIG.BUTTON_CURSOR);
        }
        Canvas2D.drawImage(this._activeSprite, this._position);
    }
}