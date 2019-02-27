import { IMenuCommand } from './menu-command';
import { Game } from '../../game';

export class GoToPreviousMenuCommand implements IMenuCommand {

    //------Constructor------//

    constructor(private _game: Game) {}

    //------Public Methods------//
    
    public execute(): void {
        this._game.goToPreviousMenu();
    }

}