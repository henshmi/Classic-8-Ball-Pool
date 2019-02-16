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

    _stick: Stick;
    _cueBall: Ball;
    _balls: Ball[];
    _players: Player[];
    _currentPlayerIndex = 0;
    _turnState: State;
    _referee: Referee;

    private get currentPlayer(): Player {
        return this._players[this._currentPlayerIndex];
    }

    private get nextPlayer(): Player {
        return this._players[(this._currentPlayerIndex + 1) % this._players.length];
    }

    constructor() {
        const redBalls: Ball[] = GAME_CONFIG.RED_BALLS_POSITIONS
            .map((position: Vector2) => new Ball(Vector2.copy(position), Color.yellow));

        const yellowBalls: Ball[] = GAME_CONFIG.YELLOW_BALLS_POSITIONS
            .map((position: Vector2) => new Ball(Vector2.copy(position), Color.red));
        
        const eightBall = new Ball(Vector2.copy(GAME_CONFIG.EIGHT_BALL_POSITION), Color.black);

        this._cueBall = new Ball(Vector2.copy(GAME_CONFIG.CUE_BALL_POSITION), Color.white);

        this._stick = new Stick(Vector2.copy(GAME_CONFIG.CUE_BALL_POSITION));

        this._balls = [
            this._cueBall, 
            ...redBalls, 
            ... yellowBalls, 
            eightBall
        ].sort((a: Ball, b: Ball) => {
            return a.position.x - b.position.x;
        });

        this._players = [
            new Player(),
            new Player(),
        ];

        this._turnState = new State();

        this._referee = new Referee();
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

    private handleCollisions(): void {
        for(let i = 0 ; i < this._balls.length ; i++ ){ 
            for(let j = i+1 ; j < this._balls.length ; j++ ){
                const firstBall = this._balls[i];
                const secondBall = this._balls[j];
                const collided = firstBall.collideWithBall(secondBall);
                
                if(collided && !this._turnState.firstCollidedBallColor){
                    const color: Color = firstBall.color === Color.white ? secondBall.color : firstBall.color;
                    this._turnState.firstCollidedBallColor = color;
                }
            }
        }    
    }

    private handleBallsInPockets(): void {
        this._balls.forEach((ball: Ball) => {
            if (ball.insidePocket && !this._turnState.pocketedBalls.includes(ball)) {
                if(!this.currentPlayer.color && 
                    this.nextPlayer.color !== ball.color &&
                    (ball.color === Color.red || ball.color === Color.yellow)) {
                    this.currentPlayer.color = ball.color;
                }
                this._turnState.pocketedBalls.push(ball);
            }
        });
    }

    private ballsMoving(): boolean {
        return this._balls.some(ball => ball.moving);
    }

    private concludeTurn(): void {
        this._turnState.isValid = this._referee.isValidTurn(this.currentPlayer, this._turnState);
        console.log(this._turnState);
        console.log(this._currentPlayerIndex ,this.currentPlayer);
    }

    private nextTurn(): void {
        if(this._cueBall.insidePocket){
            this._cueBall.relocate(Vector2.copy(GAME_CONFIG.CUE_BALL_POSITION));
        }

        this._turnState.pocketedBalls.forEach((ball: Ball) => {
            const ballIndex: number = this._balls.indexOf(ball);
            if(ball.color != Color.white) {
                this._balls.splice(ballIndex, 1);
            }
        });

        this._stick.relocate(this._cueBall.position);
        this._turnState = new State();
        this._currentPlayerIndex++;
        this._currentPlayerIndex = this._currentPlayerIndex % this._players.length;
    }

    public update(): void {
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
        this._balls.forEach((ball: Ball) => ball.draw());
        this._stick.draw();
    }
}