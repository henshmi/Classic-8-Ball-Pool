import { Ball } from './Ball';
import { Color } from "../common/Color";

export class State {
    public firstCollidedBallColor: Color;
    public pocketedBalls: Ball[] = [];
    public isValid = false;
}