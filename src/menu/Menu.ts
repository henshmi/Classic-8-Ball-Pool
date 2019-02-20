import { IMenuCommand } from './commands/IMenuCommand';
import { MenuButton } from './MenuButton';
import { Assets } from '../Assets';
import { Canvas2D } from '../Canvas';
import { GAME_CONFIG } from '../game.config';
import { MenuActionType } from './MenuActionType';
import { MenuLabel } from './MenuLabel';

export class Menu {

    private _labels: MenuLabel[];
    private _buttons: MenuButton[]
    private _active: boolean;
    private _subMenus: Menu[]

    public set active(value: boolean) {
        this._active = value;
    }

    public get active(): boolean {
        return this._active;
    }

    public init(actionsMap: Map<MenuActionType, IMenuCommand>, config: any): void {
        this._buttons = config.BUTTONS.map((button: any) => {
            return new MenuButton(
                    actionsMap.get(button.action),
                    button.value,
                    button.position, 
                    button.sprite, 
                    button.spriteOnHover,
                );
        });

        this._labels = config.LABELS.map((label: any) => {
            return new MenuLabel(
                    label.text, 
                    label.position, 
                    label.font, 
                    label.color, 
                    label.alignment
                );
        });

        this._subMenus = config.SUB_MENUS.map((menu: any) => {
            const subMenu = new Menu();
            subMenu.init(actionsMap, menu);
            return subMenu;
        });
    }

    public getSubMenu(index: number) {
        return this._subMenus[index];
    }

    public update(): void {
        if(this._active) {
            this._buttons.forEach((button: MenuButton) => button.update());
        }

        this._subMenus.forEach((menu: Menu) => menu.update());
    }

    public draw(): void {
        if(this._active){
            Canvas2D.changeCursor(GAME_CONFIG.DEFAULT_CURSOR);
            Canvas2D.drawImage(Assets.getSprite(GAME_CONFIG.SPRITES.MAIN_MENU_BACKGROUND))
            this._labels.forEach((label: MenuLabel) => label.draw());
            this._buttons.forEach((button: MenuButton) => button.draw());
        }
        this._subMenus.forEach((menu: Menu) => menu.draw());
    }
}