import { IMenuCommand } from './IMenuCommand';
import { Game } from '../../Game';

export class GoToPreviousMenuCommand implements IMenuCommand {

    constructor(private _game: Game) {}
    
    execute(): void {
        this._game.goToPreviousMenu();
    }

}