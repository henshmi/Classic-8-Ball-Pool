import { IMenuConfig, IButton, ILabel, ICursorConfig, IAssetsConfig } from './../game.config.type';
import { IMenuCommand } from './commands/menu-command';
import { MenuButton } from './menu-button';
import { Assets } from '../assets';
import { Canvas2D } from '../canvas';
import { GameConfig } from '../game.config';
import { MenuActionType } from './menu-action-type';
import { MenuLabel } from './menu-label';

//------Configurations------//

const cursorConfig: ICursorConfig = GameConfig.cursor;
const sprites: IAssetsConfig = GameConfig.sprites;

export class Menu {

    //------Members------//

    private _labels: MenuLabel[];
    private _buttons: MenuButton[]
    private _active: boolean;
    private _subMenus: Menu[]

    //------Properties------//

    public set active(value: boolean) {
        this._active = value;
    }

    public get active(): boolean {
        return this._active;
    }

    //------Public Methods------//

    public init(actionsMap: Map<MenuActionType, IMenuCommand>, config: IMenuConfig): void {
        this._buttons = config.buttons.map((button: IButton) => {
            return new MenuButton(
                    actionsMap.get(button.action),
                    button.value,
                    button.position, 
                    button.sprite, 
                    button.spriteOnHover,
                );
        });

        this._labels = config.labels.map((label: ILabel) => {
            return new MenuLabel(
                    label.text, 
                    label.position, 
                    label.font, 
                    label.color, 
                    label.alignment
                );
        });

        this._subMenus = config.subMenus.map((menu: IMenuConfig) => {
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
            Canvas2D.changeCursor(cursorConfig.default);
            Canvas2D.drawImage(Assets.getSprite(sprites.paths.menuBackground))
            this._labels.forEach((label: MenuLabel) => label.draw());
            this._buttons.forEach((button: MenuButton) => button.draw());
        }
        this._subMenus.forEach((menu: Menu) => menu.draw());
    }
}