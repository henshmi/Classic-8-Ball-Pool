import { Assets } from './Assets';
import { GameWorld } from './game-objects/GameWorld';
import { Keyboard } from './input/Keyboard';
import { Canvas2D } from './Canvas';
import { Mouse } from './input/Mouse';

let poolGame: GameWorld;

async function initGame(): Promise<void> {
    await Assets.loadGameAssets();

    poolGame = new GameWorld();
    gameLoop();
}

function update(): void {
    poolGame.update();
    Keyboard.reset();
    Mouse.reset();
}

function draw(): void {
    Canvas2D.clear();
    poolGame.draw();
}

function gameLoop(): void {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

initGame();