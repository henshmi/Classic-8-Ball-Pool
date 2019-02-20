import { Game } from './../../Game';
import { IMenuCommand } from './IMenuCommand';
import { GameWorld } from '../../game-objects/GameWorld';

export class PVPCommand implements IMenuCommand {
    
    constructor(private _game: Game) {}
    
    execute(): void {
        this._game.start();
    }

}