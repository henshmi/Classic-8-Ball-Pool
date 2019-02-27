import { Ball } from './ball';
import { Color } from "../common/color";

export class State {

    //------Properties------//

    public firstCollidedBallColor: Color;
    public pocketedBalls: Ball[] = [];
    public ballInHand = false;
    public isValid = false;
}