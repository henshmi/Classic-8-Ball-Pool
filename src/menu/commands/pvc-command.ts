import { GAME_CONFIG } from './../../game.config';
import { IMenuCommand } from './menu-command';
import { Game } from '../../game';

export class PVCCommand implements IMenuCommand {
   
    constructor(private _game: Game) {}
    
    execute(iterationsValue: number): void {
        GAME_CONFIG.AI_ON = true;
        GAME_CONFIG.AI_TRAIN_ITERATIONS = iterationsValue;
        this._game.start();
    }
}