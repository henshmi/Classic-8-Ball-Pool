import { IMenuCommand } from './IMenuCommand';
import { Game } from '../../Game';
import { GameWorld } from '../../game-objects/GameWorld';

export class PVCCommand implements IMenuCommand {
   
    constructor(private _game: Game) {}
    
    execute(): void {
        this._game.start();
    }
}