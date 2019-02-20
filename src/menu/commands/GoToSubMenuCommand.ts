import { Game } from './../../Game';
import { IMenuCommand } from './IMenuCommand';

export class GoToSubMenuCommand implements IMenuCommand {

    constructor(private _game: Game) {}

    execute(value: any): void {
       this._game.goToSubMenu(value);
    }

}