import { mapRange } from './../common/Helper';
import { Referee } from './Referee';
import { Player } from './Player';
import { Stick } from './Stick';
import { Color } from '../common/Color';
import { Vector2 } from '../geom/Vector2';
import { GAME_CONFIG } from '../game.config';
import { Assets } from '../Assets';
import { Canvas2D } from '../Canvas';
import { Ball } from './Ball';
import { Mouse } from '../input/Mouse';
import { State } from './State';

export class GameWorld {

    //------Members------//

    _stick: Stick;
    _cueBall: Ball;
    _8Ball: Ball;
    _balls: Ball[];
    _players: Player[] = [
        new Player(),
        new Player(),
    ];
    _currentPlayerIndex = 0;
    _turnState: State;
    _referee: Referee;

    //------Properties------//

    private get currentPlayer(): Player {
        return this._players[this._currentPlayerIndex];
    }

    private get nextPlayer(): Player {
        return this._players[(this._currentPlayerIndex + 1) % this._players.length];
    }

    //------Constructor------//

    constructor() {
        this.initMatch();
    }

    //------Private Methods------//

    private getBallsByColor(color: Color): Ball[] {
        return this._balls.filter((ball: Ball) => ball.color === color);
    }

    private shootCueBall(): void {
        if(this._stick.power > 0) {
            this._stick.shoot();
            this._cueBall.shoot(this._stick.power, this._stick.rotation);
            this._stick.movable = false;
            setTimeout(() => this._stick.hide(), GAME_CONFIG.TIMEOUT_TO_HIDE_STICK_AFTER_SHOT);
        }
    }

    private handleInput(): void {
        if (Mouse.isPressed(GAME_CONFIG.SHOOT_MOUSE_BUTTON)) {
            this.shootCueBall();
        }
    }

    private resolveBallCollisionWithCushion(ball: Ball): void {

        const ballRadius: number = GAME_CONFIG.BALL_DIAMETER / 2;
        const topBallEdge: number = ball.nextPosition.y - ballRadius;
        const leftBallEdge: number = ball.nextPosition.x - ballRadius;
        const rightBallEdge: number = ball.nextPosition.x + ballRadius;
        const bottomBallEdge: number = ball.nextPosition.y + ballRadius;

        let collided: boolean = false;

        if(topBallEdge <= GAME_CONFIG.CUSHION_WIDTH) {
            ball.position = ball.position.addY(GAME_CONFIG.CUSHION_WIDTH - ball.position.y + ballRadius);
            ball.velocity = new Vector2(ball.velocity.x, -ball.velocity.y);
            collided = true;
        }
        if(leftBallEdge <= GAME_CONFIG.CUSHION_WIDTH) {
            ball.position = ball.position.addX(GAME_CONFIG.CUSHION_WIDTH - ball.position.x + ballRadius);
            ball.velocity = new Vector2(-ball.velocity.x, ball.velocity.y);
            collided = true;
        }
        if(rightBallEdge >= GAME_CONFIG.GAME_WIDTH - GAME_CONFIG.CUSHION_WIDTH) {
            ball.position = ball.position.addX(GAME_CONFIG.GAME_WIDTH - GAME_CONFIG.CUSHION_WIDTH - ball.position.x - ballRadius);
            ball.velocity = new Vector2(-ball.velocity.x, ball.velocity.y);
            collided = true;
        }
        if(bottomBallEdge >= GAME_CONFIG.GAME_HEIGHT - GAME_CONFIG.CUSHION_WIDTH) {
            ball.position = ball.position.addY(GAME_CONFIG.GAME_HEIGHT - GAME_CONFIG.CUSHION_WIDTH - ball.position.y - ballRadius);
            ball.velocity = new Vector2(ball.velocity.x, -ball.velocity.y);
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

    private resolveBallInPocket(ball: Ball): boolean {

        const inPocket: boolean = GAME_CONFIG.POCKETS_POSITIONS
            .some((pocketPos: Vector2) => ball.position.distFrom(pocketPos) <= GAME_CONFIG.POCKET_RADIUS);

        if(inPocket) {
            ball.hide();
        }

        return inPocket;
    }

    private isValidPlayerColor(color: Color): boolean {
        return color === Color.red || color === Color.yellow;
    }

    private handleBallsInPockets(): void {
        this._balls.forEach((ball: Ball) => {
            const inPocket = this.resolveBallInPocket(ball);
            if (inPocket && !this._turnState.pocketedBalls.includes(ball)) {
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

        if(Mouse.isPressed(GAME_CONFIG.PLACE_BALL_IN_HAND_MOUSE_BUTTON)) {
            this._turnState.ballInHand = false;
            this._stick.show(this._cueBall.position);
        }
        else {
            this._stick.movable = false;
            this._stick.visible = false;
            this._cueBall.position = Mouse.position;
        }
    }

    private ballsMoving(): boolean {
        return this._balls.some(ball => ball.moving);
    }

    private concludeTurn(): void {

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

    private gameOver(): void {
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

        if(!this._8Ball.visible){
            this.gameOver();
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
                GAME_CONFIG.OVERALL_SCORE_LABELS_ALLIGNMENT
                );   
        }
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
    }

    public update(): void {
        if(this._turnState.ballInHand) {
            this.handleBallInHand();
            return;
        }
        this.handleBallsInPockets();
        this.handleCollisions();
        this.handleInput();
        this._stick.update();
        this._balls.forEach((ball: Ball) => ball.update());

        if(!this.ballsMoving() && !this._stick.visible) {
            this.concludeTurn();
            this.nextTurn();
        }
    }

    public draw(): void {
        Canvas2D.drawImage(Assets.getSprite(GAME_CONFIG.SPRITES.TABLE));
        this.drawCurrentPlayerLabel();
        this.drawOverallScores();
        this._balls.forEach((ball: Ball) => ball.draw());
        this._stick.draw();
        this.drawMatchScores();
    }
}