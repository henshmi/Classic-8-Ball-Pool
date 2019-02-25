import { AI } from './../ai/ai-trainer';
import { mapRange } from '../common/helper';
import { Referee } from './referee';
import { Player } from './player';
import { Stick } from './stick';
import { Color } from '../common/color';
import { Vector2 } from '../geom/vector2';
import { GAME_CONFIG } from '../game.config';
import { Assets } from '../assets';
import { Canvas2D } from '../canvas';
import { Ball } from './ball';
import { Mouse } from '../input/mouse';
import { State } from './state';

export class GameWorld {

    //------Members------//

    private _stick: Stick;
    private _cueBall: Ball;
    private _8Ball: Ball;
    private _balls: Ball[];
    private _players: Player[] = [new Player(), new Player()];
    private _currentPlayerIndex = 0;
    private _turnState: State;
    private _referee: Referee;

    //------Properties------//

    public get currentPlayer(): Player {
        return this._players[this._currentPlayerIndex];
    }

    public get nextPlayer(): Player {
        return this._players[(this._currentPlayerIndex + 1) % this._players.length];
    }

    public get balls(): Ball[] {
        return this._balls
    }

    public get isBallInHand(): boolean {
        return this._turnState.ballInHand;
    }

    public get isTurnValid(): boolean {
        return this._turnState.isValid;
    }

    public get isGameOver(): boolean {
        return this._referee.isGameOver(this.currentPlayer, this._cueBall, this._8Ball);
    }

    public get isBallsMoving(): boolean {
        return this._balls.some(ball => ball.moving);
    }

    public get numOfPocketedBallsOnTurn(): number {
        return this._turnState.pocketedBalls.length;
    }

    //------Constructor------//

    constructor() {
        this.initMatch();
    }

    //------Private Methods------//

    private getBallsByColor(color: Color): Ball[] {
        return this._balls.filter((ball: Ball) => ball.color === color);
    }

    private handleInput(): void {
        if (AI.finishedSession && Mouse.isPressed(GAME_CONFIG.SHOOT_MOUSE_BUTTON)) {
            this.shootCueBall(this._stick.power, this._stick.rotation);
        }
    }

    private isBallPosOutsideTopBorder(position: Vector2): boolean {
        const topBallEdge: number = position.y - GAME_CONFIG.BALL_DIAMETER / 2;
        return topBallEdge <= GAME_CONFIG.CUSHION_WIDTH;
    }

    private isBallPosOutsideLeftBorder(position: Vector2): boolean {
        const leftBallEdge: number = position.x - GAME_CONFIG.BALL_DIAMETER / 2;
        return leftBallEdge <= GAME_CONFIG.CUSHION_WIDTH;
    }

    private isBallPosOutsideRightBorder(position: Vector2): boolean {
        const rightBallEdge: number = position.x + GAME_CONFIG.BALL_DIAMETER / 2;
        return rightBallEdge >= GAME_CONFIG.GAME_WIDTH - GAME_CONFIG.CUSHION_WIDTH;
    }

    private isBallPosOutsideBottomBorder(position: Vector2): boolean {
        const bottomBallEdge: number = position.y + GAME_CONFIG.BALL_DIAMETER / 2;
        return bottomBallEdge >= GAME_CONFIG.GAME_HEIGHT - GAME_CONFIG.CUSHION_WIDTH;
    }

    private handleCollisionWithTopCushion(ball: Ball): void {
        ball.position = ball.position.addY(GAME_CONFIG.CUSHION_WIDTH - ball.position.y + GAME_CONFIG.BALL_DIAMETER / 2);
        ball.velocity = new Vector2(ball.velocity.x, -ball.velocity.y);
    }

    private handleCollisionWithLeftCushion(ball: Ball): void {
        ball.position = ball.position.addX(GAME_CONFIG.CUSHION_WIDTH - ball.position.x + GAME_CONFIG.BALL_DIAMETER / 2);
        ball.velocity = new Vector2(-ball.velocity.x, ball.velocity.y);
    }

    private handleCollisionWithRightCushion(ball: Ball): void {
        ball.position = ball.position.addX(GAME_CONFIG.GAME_WIDTH - GAME_CONFIG.CUSHION_WIDTH - ball.position.x - GAME_CONFIG.BALL_DIAMETER / 2);
        ball.velocity = new Vector2(-ball.velocity.x, ball.velocity.y);
    }

    private handleCollisionWithBottomCushion(ball: Ball): void {
        ball.position = ball.position.addY(GAME_CONFIG.GAME_HEIGHT - GAME_CONFIG.CUSHION_WIDTH - ball.position.y - GAME_CONFIG.BALL_DIAMETER / 2);
        ball.velocity = new Vector2(ball.velocity.x, -ball.velocity.y);
    }

    private resolveBallCollisionWithCushion(ball: Ball): void {

        let collided: boolean = false;

        if(this.isBallPosOutsideTopBorder(ball.nextPosition)) {
            this.handleCollisionWithTopCushion(ball);
            collided = true;
        }
        if(this.isBallPosOutsideLeftBorder(ball.nextPosition)) {
            this.handleCollisionWithLeftCushion(ball);
            collided = true;
        }
        if(this.isBallPosOutsideRightBorder(ball.nextPosition)) {
            this.handleCollisionWithRightCushion(ball);
            collided = true;
        }
        if(this.isBallPosOutsideBottomBorder(ball.nextPosition)) {
            this.handleCollisionWithBottomCushion(ball);
            collided = true;
        }

        if(collided) {
            ball.velocity = ball.velocity.mult(1 - GAME_CONFIG.COLLISION_LOSS);
        }
    }

    private resolveBallsCollision (first: Ball, second: Ball): boolean {

        if(!first.visible || !second.visible){
            return false;
        }
    
        // Find a normal vector
        const n: Vector2 = first.position.subtract(second.position);
    
        // Find distance
        const dist: number = n.length;
    
        if(dist > GAME_CONFIG.BALL_DIAMETER){
            return false;
        }
    
        // Find minimum translation distance
        const mtd = n.mult((GAME_CONFIG.BALL_DIAMETER - dist) / dist);
    
        // Push-pull balls apart
        first.position = first.position.add(mtd.mult(0.5));
        second.position = second.position.subtract(mtd.mult(0.5));
    
        // Find unit normal vector
        const un = n.mult(1/n.length);
    
        // Find unit tangent vector
        const ut = new Vector2(-un.y, un.x);
    
        // Project velocities onto the unit normal and unit tangent vectors
        const v1n: number = un.dot(first.velocity);
        const v1t: number = ut.dot(first.velocity);
        const v2n: number = un.dot(second.velocity);
        const v2t: number = ut.dot(second.velocity);
    
        // Convert the scalar normal and tangential velocities into vectors
        const v1nTag: Vector2 = un.mult(v2n);
        const v1tTag: Vector2 = ut.mult(v1t);
        const v2nTag: Vector2 = un.mult(v1n);
        const v2tTag: Vector2 = ut.mult(v2t);
    
        // Update velocities
        first.velocity = v1nTag.add(v1tTag);
        second.velocity = v2nTag.add(v2tTag);
    
        first.velocity = first.velocity.mult(1 - GAME_CONFIG.COLLISION_LOSS);
        second.velocity = second.velocity.mult(1 - GAME_CONFIG.COLLISION_LOSS);
        
        return true;
    }

    private handleCollisions(): void {
        for(let i = 0 ; i < this._balls.length ; i++ ){ 
            
            this.resolveBallCollisionWithCushion(this._balls[i]);

            for(let j = i + 1 ; j < this._balls.length ; j++ ){
                const firstBall = this._balls[i];
                const secondBall = this._balls[j];
                const collided = this.resolveBallsCollision(firstBall, secondBall);
                
                if(collided){
                    const force: number = firstBall.velocity.length + secondBall.velocity.length
                    const volume: number = mapRange(force, 0, GAME_CONFIG.MAX_BALL_EXPECTED_COLLISION_FORCE, 0, 1);
                    Assets.playSound(GAME_CONFIG.SOUNDS.BALLS_COLLIDE, volume);

                    if(!this._turnState.firstCollidedBallColor) {
                        const color: Color = firstBall.color === Color.white ? secondBall.color : firstBall.color;
                        this._turnState.firstCollidedBallColor = color;
                    }
                }
            }
        }    
    }

    private isInsidePocket(position: Vector2): boolean {
        return GAME_CONFIG.POCKETS_POSITIONS
            .some((pocketPos: Vector2) => position.distFrom(pocketPos) <= GAME_CONFIG.POCKET_RADIUS);

    }

    private resolveBallInPocket(ball: Ball): void {

        if (this.isInsidePocket(ball.position)) {
            ball.hide();
        }
    }

    private isValidPlayerColor(color: Color): boolean {
        return color === Color.red || color === Color.yellow;
    }

    private handleBallsInPockets(): void {
        this._balls.forEach((ball: Ball) => {
            this.resolveBallInPocket(ball);
            if (!ball.visible && !this._turnState.pocketedBalls.includes(ball)) {
                Assets.playSound(GAME_CONFIG.SOUNDS.RAIL, 1);
                if(!this.currentPlayer.color && this.isValidPlayerColor(ball.color)) {
                    this.currentPlayer.color = ball.color;
                    this.nextPlayer.color = ball.color === Color.yellow ? Color.red : Color.yellow;
                }
                this._turnState.pocketedBalls.push(ball);
            }
        });
    }

    private handleBallInHand(): void {

        if(Mouse.isPressed(GAME_CONFIG.PLACE_BALL_IN_HAND_MOUSE_BUTTON) && this.isValidPosToPlaceCueBall(Mouse.position)) {
            this.placeBallInHand(Mouse.position);
        }
        else {
            this._stick.movable = false;
            this._stick.visible = false;
            this._cueBall.position = Mouse.position;
        }
    }

    private handleGameOver(): void {
        if (this._turnState.isValid) {
            this.currentPlayer.overallScore++;
        }
        else {
            this.nextPlayer.overallScore++;
        }
        this.initMatch();
    }

    private nextTurn(): void {

        const foul = !this._turnState.isValid;

        if (this.isGameOver) {
            this.handleGameOver();
            return;
        }

        if(!this._cueBall.visible){
            this._cueBall.show(Vector2.copy(GAME_CONFIG.CUE_BALL_POSITION));
        }

        if(foul || this._turnState.pocketedBalls.length === 0) {
            this._currentPlayerIndex++;
            this._currentPlayerIndex = this._currentPlayerIndex % this._players.length;
        }

        this._stick.show(this._cueBall.position);

        this._turnState = new State();
        this._turnState.ballInHand = foul;

        if (this.isAITurn()) {
            AI.startSession(this);
        }
    }

    private drawCurrentPlayerLabel(): void {
        
        Canvas2D.drawText(
            GAME_CONFIG.CURRENT_PLAYER_LABEL + (this._currentPlayerIndex + 1), 
            GAME_CONFIG.CURRENT_PLAYER_LABEL_FONT, 
            GAME_CONFIG.CURRENT_PLAYER_LABEL_COLOR, 
            GAME_CONFIG.CURRENT_PLAYER_LABEL_POSITION, 
            GAME_CONFIG.CURRENT_PLAYER_LABEL_ALIGNMENT
            );
    }

    private drawMatchScores(): void {
        for(let i = 0 ; i < this._players.length ; i++){    
            for(let j = 0 ; j < this._players[i].matchScore ; j++){
                const scorePosition: Vector2 = Vector2.copy(GAME_CONFIG.MATCH_SCORE_POSITIONS[i]).addToX(j * GAME_CONFIG.MATCH_SCORE_MARGIN);
                const scoreSprite: HTMLImageElement = this._players[i].color === Color.red ? Assets.getSprite(GAME_CONFIG.SPRITES.RED_SCORE) : Assets.getSprite(GAME_CONFIG.SPRITES.YELLOW_SCORE);
                Canvas2D.drawImage(scoreSprite, scorePosition);
            }
        }    
    }

    private drawOverallScores(): void {
        for(let i = 0 ; i < this._players.length ; i++){ 
            Canvas2D.drawText(
                this._players[i].overallScore.toString(), 
                GAME_CONFIG.OVERALL_SCORE_LABEL_FONT,
                GAME_CONFIG.OVERALL_SCORE_LABEL_COLOR,
                GAME_CONFIG.OVERALL_SCORE_LABELS_POSITIONS[i],
                GAME_CONFIG.OVERALL_SCORE_LABEL_ALIGNMENT
                );   
        }
    }

    private isInsideTableBoundaries(position: Vector2): boolean {
        let insideTable: boolean =  !this.isInsidePocket(position);
        insideTable = insideTable && !this.isBallPosOutsideTopBorder(position);
        insideTable = insideTable && !this.isBallPosOutsideLeftBorder(position);
        insideTable = insideTable && !this.isBallPosOutsideRightBorder(position);
        insideTable = insideTable && !this.isBallPosOutsideBottomBorder(position);

        return insideTable;
    }

    private isAITurn(): boolean {
        return AI.finishedSession && GAME_CONFIG.AI_ON && this._currentPlayerIndex === GAME_CONFIG.AI_PLAYER_INDEX;
    }

    //------Public Methods------//

    public initMatch(): void {

        const redBalls: Ball[] = GAME_CONFIG.RED_BALLS_POSITIONS
            .map((position: Vector2) => new Ball(Vector2.copy(position), Color.yellow));

        const yellowBalls: Ball[] = GAME_CONFIG.YELLOW_BALLS_POSITIONS
            .map((position: Vector2) => new Ball(Vector2.copy(position), Color.red));
        
        this._8Ball = new Ball(Vector2.copy(GAME_CONFIG.EIGHT_BALL_POSITION), Color.black);

        this._cueBall = new Ball(Vector2.copy(GAME_CONFIG.CUE_BALL_POSITION), Color.white);

        this._stick = new Stick(Vector2.copy(GAME_CONFIG.CUE_BALL_POSITION));

        this._balls = [
            ...redBalls, 
            ... yellowBalls, 
            this._8Ball,
            this._cueBall, 
        ];

        this._currentPlayerIndex = 0;

        this._players.forEach((player: Player) => {
            player.matchScore = 0;
            player.color = null;
        });
        this._turnState = new State();
        this._referee = new Referee();

        if (this.isAITurn()) {
            AI.startSession(this);
        }
    }

    public isValidPosToPlaceCueBall(position: Vector2): boolean {
        let noOverlap: boolean =  this._balls.every((ball: Ball) => {
            return ball.color === Color.white || 
                   ball.position.distFrom(position) > GAME_CONFIG.BALL_DIAMETER;
        })

        return noOverlap && this.isInsideTableBoundaries(position);
    }

    public placeBallInHand(position: Vector2): void {
        this._cueBall.position = position;
        this._turnState.ballInHand = false;
        this._stick.show(this._cueBall.position);
    }

    public concludeTurn(): void {

        this._turnState.pocketedBalls.forEach((ball: Ball) => {
            const ballIndex: number = this._balls.indexOf(ball);
            if(ball.color != Color.white) {
                this._balls.splice(ballIndex, 1);
            }
        });
        
        if(this.currentPlayer.color) {
            this.currentPlayer.matchScore = 8 - this.getBallsByColor(this.currentPlayer.color).length - this.getBallsByColor(Color.black).length;
        }

        if(this.nextPlayer.color) {
            this.nextPlayer.matchScore = 8 - this.getBallsByColor(this.nextPlayer.color).length - this.getBallsByColor(Color.black).length;
        }

        this._turnState.isValid = this._referee.isValidTurn(this.currentPlayer, this._turnState);
    }

    public shootCueBall(power: number, rotation: number): void {
        if(power > 0) {
            this._stick.rotation = rotation;
            this._stick.shoot();
            this._cueBall.shoot(power, rotation);
            this._stick.movable = false;
            setTimeout(() => this._stick.hide(), GAME_CONFIG.TIMEOUT_TO_HIDE_STICK_AFTER_SHOT);
        }
    }

    public update(): void {

        if(this.isBallInHand) {
            this.handleBallInHand();
            return;
        }

        this.handleBallsInPockets();
        this.handleCollisions();
        this.handleInput();
        this._stick.update();
        this._balls.forEach((ball: Ball) => ball.update());

        if(!this.isBallsMoving && !this._stick.visible) {
            this.concludeTurn();
            this.nextTurn();
        }
    }

    public draw(): void {
        Canvas2D.drawImage(Assets.getSprite(GAME_CONFIG.SPRITES.TABLE));
        this.drawCurrentPlayerLabel();
        this.drawMatchScores();
        this.drawOverallScores();
        this._balls.forEach((ball: Ball) => ball.draw());
        this._stick.draw();
    }
}