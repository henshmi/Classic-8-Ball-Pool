import { GAME_CONFIG } from './../../game.config';
import { Game } from '../../game';
import { IMenuCommand } from './menu-command';

export class PVPCommand implements IMenuCommand {
    
    constructor(private _game: Game) {}
    
    execute(): void {
        GAME_CONFIG.AI_ON = false;
        this._game.start();
    }

}