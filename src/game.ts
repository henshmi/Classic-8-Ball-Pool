import { AI } from './ai/ai-trainer';
import { GoToPreviousMenuCommand } from './menu/commands/go-to-previous-menu-command';
import { GoToSubMenuCommand } from './menu/commands/go-to-sub-menu-command';
import { ToggleSoundCommand } from './menu/commands/toggle-sound-command';
import { PVCCommand } from './menu/commands/pvc-command';
import { PVPCommand } from './menu/commands/pvp-command';
import { IMenuCommand } from './menu/commands/menu-command';
import { GAME_CONFIG } from './game.config';
import { MenuActionType } from './menu/menu-action-type';
import { Menu } from './menu/menu';
import { Assets } from './assets';
import { GameWorld } from './game-objects/game-world';
import { Keyboard } from './input/keyboard';
import { Canvas2D } from './canvas';
import { Mouse } from './input/mouse';

export class Game {
    private _menuActionsMap: Map<MenuActionType, IMenuCommand>;
    private _previousMenus: Menu[] = [];
    private _menu: Menu = new Menu();
    private _poolGame: GameWorld;
    private _isLoading: boolean;
    private _inGame: boolean;

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
        setTimeout(() => {
            if(this._menu){
                this._menu.active = false;
                this._previousMenus.push(this._menu);
            }
            this._menu = this._menu.getSubMenu(index);
            this._menu.active = true;   
        }, GAME_CONFIG.TIMEOUT_TO_LOAD_SUB_MENU);
    }
    
    public goToPreviousMenu(): void {
        if(this._previousMenus.length > 0) {
            setTimeout(() => {
                this._menu.active = false;
                this._menu = this._previousMenus.pop();
                this._menu.active = true; 
            }, GAME_CONFIG.TIMEOUT_TO_LOAD_SUB_MENU);
        }
    }

    public start(): void {
        this.displayLoadingScreen().then(() => {
            this._menu.active = false;
            this._inGame = true;
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
        if(this._inGame && Keyboard.isPressed(GAME_CONFIG.BACK_TO_MENU_KEY)) {
            if(this._menu.active) {
                this._menu.active = false;
            }
            else {
                this.initMainMenu();
                this._menu.active = true;
            }
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
        if(AI.finishedSession){
            Canvas2D.clear();
            this._menu.active ? this._menu.draw() : this._poolGame.draw();
        }
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