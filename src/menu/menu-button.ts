import { IMenuCommand } from './commands/menu-command';
import { GAME_CONFIG } from '../game.config';
import { Mouse } from '../input/mouse';
import { Canvas2D } from '../canvas';
import { Vector2 } from '../geom/vector2';
import { Assets } from '../assets';

export class MenuButton {

    private _activeSprite: HTMLImageElement;
    private _hovered: boolean;

    private set hovered(value: boolean) {
        this._hovered = value;
    }

    constructor(
        private _command: IMenuCommand,
        private _value: any,
        private _position: Vector2, 
        private _spriteKey: string, 
        private _spriteOnHoverKey: string,
    ) {
        this._activeSprite = Assets.getSprite(GAME_CONFIG.SPRITES[this._spriteKey]);
    }

    private isInsideButton(position: Vector2) {
        return position.x > this._position.x &&
               position.x < this._position.x + this._activeSprite.width &&
               position.y > this._position.y &&
               position.y < this._position.y + this._activeSprite.height;
    }
    
    public handleInput() {

        this.hovered = this.isInsideButton(Mouse.position);
        this._activeSprite = this._hovered ? 
                             Assets.getSprite(GAME_CONFIG.SPRITES[this._spriteOnHoverKey]) : 
                             Assets.getSprite(GAME_CONFIG.SPRITES[this._spriteKey]);

        if(this._hovered && Mouse.isPressed(GAME_CONFIG.SELECT_MOUSE_BUTTON)) {
            Canvas2D.changeCursor(GAME_CONFIG.DEFAULT_CURSOR);
            this._command.execute(this._value);
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