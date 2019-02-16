import { State } from './State';
import { Color } from './../common/Color';
import { Ball } from "./Ball";
import { Player } from "./Player";

export class Referee {

    private isValidFirstTouch(player: Player, collidedBallColor: Color): boolean {

        if(!collidedBallColor) {
            return false;
        }

        if(player.color) {
            return player.color === collidedBallColor;
        }

        return true;
    }
    
    public isValidTurn(player: Player, state: State): boolean {
        return this.isValidFirstTouch(player, state.firstCollidedBallColor);
    }
}