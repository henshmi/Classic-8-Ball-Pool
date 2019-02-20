import { GoToPreviousMenuCommand } from './menu/commands/GoToPreviousMenuCommand';
import { GoToSubMenuCommand } from './menu/commands/GoToSubMenuCommand';
import { ToggleSoundCommand } from './menu/commands/ToggleSoundCommand';
import { PVCCommand } from './menu/commands/PVCCommand';
import { PVPCommand } from './menu/commands/PVPCommand';
import { IMenuCommand } from './menu/commands/IMenuCommand';
import { GAME_CONFIG } from './game.config';
import { MenuActionType } from './menu/MenuActionType';
import { Menu } from './menu/Menu';
import { Assets } from './Assets';
import { GameWorld } from './game-objects/GameWorld';
import { Keyboard } from './input/Keyboard';
import { Canvas2D } from './Canvas';
import { Mouse } from './input/Mouse';

export class Game {
    private _menuActionsMap: Map<MenuActionType, IMenuCommand>;
    private _previousMenus: Menu[] = [];
    private _menu: Menu = new Menu();
    private _poolGame: GameWorld;
    private _isLoading: boolean;

    private initMenuActions(): void {
        this._menuActionsMap = new Map<MenuActionType, IMenuCommand>();
        this._menuActionsMap.set(MenuActionType.PVP, new PVPCommand(this));
        this._menuActionsMap.set(MenuActionType.PVC, new PVCCommand(this));
        this._menuActionsMap.set(MenuActionType.ToggleSound, new ToggleSoundCommand());
        this._menuActionsMap.set(MenuActionType.GoToSubMenu, new GoToSubMenuCommand(this));
        this._menuActionsMap.set(MenuActionType.GoToPreviousMenu, new GoToPreviousMenuCommand(this));
    }

    private initMainMenu(): void {
        this._menu.init(this._menuActionsMap, GAME_CONFIG.MAIN_MENU_CONFIG);
    }

    public async init(): Promise<void> {
        await Assets.loadGameAssets();

        this.initMenuActions();
        this.initMainMenu();
        this._menu.active = true;
        this._poolGame = new GameWorld();
        this.gameLoop();
    }

    public goToSubMenu(index: number): void {
        if(this._menu){
            this._menu.active = false;
            this._previousMenus.push(this._menu);
        }
        this._menu = this._menu.getSubMenu(index);
        this._menu.active = true;
    }
    
    public goToPreviousMenu(): void {
        if(this._previousMenus.length > 0) {
            this._menu.active = false;
            this._menu = this._previousMenus.pop();
            this._menu.active = true;
        }
    }

    public start(): void {
        this.displayLoadingScreen().then(() => {
            this._menu.active = false;
            this._poolGame = new GameWorld();
            this._poolGame.initMatch();
        });
    }

    private displayLoadingScreen(): Promise<void> {
        return new Promise((resolve) => {
            this._isLoading = true;
            Canvas2D.clear();
            Canvas2D.drawImage(
                Assets.getSprite(GAME_CONFIG.SPRITES.CONTROLS),
                GAME_CONFIG.LOADING_SCREEN_IMAGE_POSITION
                );
            setTimeout(() => {
                this._isLoading = false;
                resolve();
            }, GAME_CONFIG.LOADING_SCREEN_TIMEOUT);
        });
    }

    private handleInput(): void {
        if (!this._menu.active && Keyboard.isPressed(GAME_CONFIG.BACK_TO_MENU_KEY)) {
            this.initMainMenu();
            this._menu.active = true;
        }
    }

    private update(): void {
        if (this._isLoading) return;
        this.handleInput();
        this._menu.active ? this._menu.update() : this._poolGame.update();
        Keyboard.reset();
        Mouse.reset();
    }

    private draw(): void {
        if (this._isLoading) return;
        Canvas2D.clear();
        this._menu.active ? this._menu.draw() : this._poolGame.draw();
    }

    private gameLoop(): void {
        this.update();
        this.draw();
        window.requestAnimationFrame(() => {
            this.gameLoop();
        });
    }

}

const game = new Game();
game.init();