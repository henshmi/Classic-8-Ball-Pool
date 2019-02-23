import { GAME_CONFIG } from './../game.config';
import { GameWorld } from './../game-objects/game-world';

export class AIPolicy {

    constructor() {}

    public evaluate(gameWorld: GameWorld): number {

        let evaluation: number = 1;

        for (let i = 0 ; i < gameWorld.balls.length; i++){
            for(let j = i + 1 ; j < gameWorld.balls.length ; j++){
    
                let firstBall = gameWorld.balls[i];
                let secondBall = gameWorld.balls[j];
    
                evaluation += firstBall.position.distFrom(secondBall.position) * GAME_CONFIG.AI_BALL_DISTANCE_BONUS;
            }
        }

        if (gameWorld.isTurnValid) {
            evaluation += GAME_CONFIG.AI_VALID_TURN_BONUS;
            evaluation += GAME_CONFIG.AI_POCKETED_BALLS_BONUS * gameWorld.numOfPocketedBallsOnTurn;
            
            if (gameWorld.isGameOver) {
                evaluation += GAME_CONFIG.AI_GAME_WON_BONUS;
            }
        }
        else {
            evaluation = evaluation - GAME_CONFIG.AI_INVLID_TURN_PENALTY;

            if (gameWorld.isGameOver) {
                evaluation -= GAME_CONFIG.AI_GAME_LOSS_PENALTY;
            }
        }

        return evaluation;
    }
}