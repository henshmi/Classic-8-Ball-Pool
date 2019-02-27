import { State } from './state';
import { Color } from '../common/color';
import { Ball } from "./ball";
import { Player } from "./player";

export class Referee {

    //------Private Methods------//

    private isValidFirstTouch(player: Player, collidedBallColor: Color, somePocketed: boolean): boolean {

        if(!collidedBallColor) {
            return false;
        }
        if(!player.color) {
            return collidedBallColor !== Color.black;
        }

        return player.color === collidedBallColor || 
               (player.matchScore === 1 && somePocketed && collidedBallColor !== Color.black) ||
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
    
    //------Public Methods------//

    public isValidTurn(player: Player, state: State): boolean {
        return this.isValidFirstTouch(player, state.firstCollidedBallColor, state.pocketedBalls.length > 0) &&
               this.isValidPocketedBalls(player, state.pocketedBalls);
    }

    public isGameOver(currentPlayer: Player, cueBall: Ball, eightBall: Ball): boolean {
        return !eightBall.visible || 
               (!cueBall.visible && currentPlayer.matchScore === 7) ||
               (!cueBall.visible && currentPlayer.matchScore === 8)
    }
}