import { GAME_CONFIG } from './game.config';
import { MenuAction } from './menu/MenuAction';
import { MainMenu } from './menu/MainMenu';
import { Assets } from './Assets';
import { GameWorld } from './game-objects/GameWorld';
import { Keyboard } from './input/Keyboard';
import { Canvas2D } from './Canvas';
import { Mouse } from './input/Mouse';

let menuActionsMap: Map<MenuAction, () => void>;
let menu: MainMenu;
let poolGame: GameWorld;
let isLoading: boolean;

const loadingScreen = () => {
    return new Promise((resolve) => {
        isLoading = true;
         Canvas2D.clear();
        Canvas2D.drawImage(
            Assets.getSprite(GAME_CONFIG.SPRITES.CONTROLS),
            GAME_CONFIG.LOADING_SCREEN_IMAGE_POSITION
            );
        setTimeout(() => {
            isLoading = false;
            resolve();
        }, GAME_CONFIG.LOADING_SCREEN_TIMEOUT);
    });
}

const pvp = () => {
    loadingScreen().then(() => {
        menu.active = false;
        poolGame.initMatch();
    });
}

const initMenuActions = () => {
    menuActionsMap = new Map<MenuAction, () => void>();
    menuActionsMap.set(MenuAction.PVP, pvp);
}

const initGame = async () => {
    await Assets.loadGameAssets();

    initMenuActions();
    menu = new MainMenu(menuActionsMap);
    menu.active = true;
    poolGame = new GameWorld();
    gameLoop();
}

const handleInput = () => {
    if (Keyboard.isPressed(GAME_CONFIG.BACK_TO_MENU_KEY)) {
        menu.active = true;
    }
}

const update = () => {
    if (isLoading) return;
    handleInput();
    menu.active ? menu.update() : poolGame.update();
    Keyboard.reset();
    Mouse.reset();
}

const draw = () => {
    if (isLoading) return;
    Canvas2D.clear();
    menu.active ? menu.draw() : poolGame.draw();
}

const gameLoop = () => {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

initGame();