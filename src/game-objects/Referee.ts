import { State } from './State';
import { Color } from './../common/Color';
import { Ball } from "./Ball";
import { Player } from "./Player";

export class Referee {

    private isValidFirstTouch(player: Player, collidedBallColor: Color): boolean {

        if(!collidedBallColor) {
            return false;
        }
        if(!player.color) {
            return collidedBallColor !== Color.black;
        }

        return player.color === collidedBallColor || 
               (player.matchScore === 7 && collidedBallColor === Color.black) ||
               (player.matchScore === 8 && collidedBallColor === Color.black); 
    }

    private isValidPocketedBalls(player: Player, pocketedBalls: Ball[]): boolean {
        if(pocketedBalls.length === 0) {
            return true;
        }
        if(player.color) {
            if (player.matchScore === 8) {
                return pocketedBalls.length === 1 && pocketedBalls[0].color === Color.black;
            }
            else {
                return pocketedBalls.every((ball: Ball) => ball.color === player.color);
            }
        } else {
            const color = pocketedBalls[0].color;
            return color !== Color.white &&
                   color !== Color.black &&
                   pocketedBalls.every((ball: Ball) => ball.color === color);
        }
    }
    
    public isValidTurn(player: Player, state: State): boolean {
        return this.isValidFirstTouch(player, state.firstCollidedBallColor) &&
               this.isValidPocketedBalls(player, state.pocketedBalls);
    }
}