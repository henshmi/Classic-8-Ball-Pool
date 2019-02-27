import { GameConfig } from './../game.config';
import { GameWorld } from './../game-objects/game-world';

export class AIPolicy {

    constructor() {}

    public evaluate(gameWorld: GameWorld): number {

        let evaluation: number = 1;

        for (let i = 0 ; i < gameWorld.balls.length; i++){
            for(let j = i + 1 ; j < gameWorld.balls.length ; j++){
    
                let firstBall = gameWorld.balls[i];
                let secondBall = gameWorld.balls[j];
    
                evaluation += firstBall.position.distFrom(secondBall.position) * GameConfig.ai.ballDistanceBonus;
            }
        }

        if (gameWorld.isTurnValid) {
            evaluation += GameConfig.ai.validTurnBonus;
            evaluation += GameConfig.ai.pocketedBallBonus * gameWorld.numOfPocketedBallsOnTurn;
            
            if (gameWorld.isGameOver) {
                evaluation += GameConfig.ai.gameWonBonus;
            }
        }
        else {
            evaluation = evaluation - GameConfig.ai.invalidTurnPenalty;

            if (gameWorld.isGameOver) {
                evaluation -= GameConfig.ai.gameLossPenalty;
            }
        }

        return evaluation;
    }
}