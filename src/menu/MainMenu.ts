import { MenuButton } from './MenuButton';
import { Assets } from './../Assets';
import { Canvas2D } from './../Canvas';
import { GAME_CONFIG } from '../game.config';
import { MenuAction } from './MenuAction';

export class MainMenu {

    private _buttons: MenuButton[]
    private _active: boolean;

    public set active(value: boolean) {
        this._active = value;
    }

    public get active(): boolean {
        return this._active;
    }

    constructor(actionsMap: Map<MenuAction, () => void>) {
        this._buttons = GAME_CONFIG.MAIN_MENU_BUTTONS.map((button: any) => {
            return new MenuButton(
                    actionsMap.get(button.action),
                    button.position, 
                    Assets.getSprite(GAME_CONFIG.SPRITES[button.sprite]), 
                    Assets.getSprite(GAME_CONFIG.SPRITES[button.spriteOnHover])
                );
        });
    }

    public update(): void {
        this._buttons.forEach((button: MenuButton) => button.update());
    }

    public draw(): void {
        Canvas2D.changeCursor(GAME_CONFIG.DEFAULT_CURSOR);
        Canvas2D.drawImage(Assets.getSprite(GAME_CONFIG.SPRITES.MAIN_MENU_BACKGROUND))
        this._buttons.forEach((button: MenuButton) => button.draw());
    }
}