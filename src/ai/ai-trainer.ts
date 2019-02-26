import { Vector2 } from './../geom/vector2';
import { GAME_CONFIG } from './../game.config';
import { GameWorld } from './../game-objects/game-world';
import { AIOpponent } from './ai-opponent';
import { AIPolicy } from './ai-policy';
import cloneDeep = require('lodash/cloneDeep');
import { Mouse } from '../input/mouse';

export class AITrainer {

    private _policy: AIPolicy;
    private _opponents: AIOpponent[];
    private _currentOpponent: AIOpponent;
    private _initialGameWorld: GameWorld;
    private _gameWorld: GameWorld;
    private _iteration: number = 0;
    private _finishedSession: boolean = true;
    private _bestOpponent: AIOpponent;
    private _soundOnState: boolean;

    public get finishedSession() : boolean {
        return this._finishedSession;
    }

    constructor() {
        this._policy = new AIPolicy();
    }

    private placeBallInHand(gameWorld: GameWorld): void {
        debugger;
        
        let marginX = 5;
        let pos = Vector2.copy(GAME_CONFIG.CUE_BALL_POSITION);

        while(!gameWorld.isValidPosToPlaceCueBall(pos)) {
            pos.addToX(marginX);
        }

        gameWorld.placeBallInHand(pos);
    }

    private init(): void {
        this._opponents = [];
        this._currentOpponent = this.createRandomOpponent();
        this._bestOpponent = this._currentOpponent;
        this._iteration = 0;
    }

    private createMutation(opponent: AIOpponent): AIOpponent {
        let newPower = opponent.power;
        newPower += (Math.random() * 2 * GAME_CONFIG.AI_SHOT_POWER_MUTATION_VARIANCE) - GAME_CONFIG.AI_SHOT_POWER_MUTATION_VARIANCE;
        newPower = newPower < GAME_CONFIG.AI_MIN_SHOT_POWER ? GAME_CONFIG.AI_MIN_SHOT_POWER : newPower;
        newPower = newPower > GAME_CONFIG.STICK_MAX_POWER ? GAME_CONFIG.STICK_MAX_POWER : newPower;
    
        let newRotation = opponent.rotation;
    
        if(opponent.evaluation > 0){
            newRotation += (1 / opponent.evaluation)*(Math.random() * 2 * Math.PI - Math.PI)
        }
        else{
            newRotation = (Math.random() * 2 * Math.PI - Math.PI);
        }

        return new AIOpponent(newPower, newRotation);
    }

    private createRandomOpponent(): AIOpponent {
        const power: number = (Math.random() * 75 + 1);
        const rotation: number = (Math.random() * 2 * Math.PI);

        return new AIOpponent(power, rotation);
    }

    private train(): void {

        if(this._iteration === GAME_CONFIG.AI_TRAIN_ITERATIONS){
            GAME_CONFIG.SOUND_ON = this._soundOnState;
            this.playTurn();
            this._finishedSession = true;
            return;
        }

        if(this._gameWorld.isBallsMoving) return;
        this._gameWorld.concludeTurn();

        this._currentOpponent.evaluation = this._policy.evaluate(this._gameWorld);

        const current: AIOpponent = new AIOpponent(
            this._currentOpponent.power,
            this._currentOpponent.rotation,
            this._currentOpponent.evaluation);

        this._opponents.push(current);

        if(current.evaluation > this._bestOpponent.evaluation){
            this._bestOpponent = current;
        }

        this._gameWorld = cloneDeep(this._initialGameWorld);
        this._currentOpponent = this.buildNewOpponent();
        this._iteration++;
        this.simulate();
    }

    public buildNewOpponent(): AIOpponent {
        if(this._iteration % 10 === 0){
            return this.createRandomOpponent();
        }
        else {
            return this.createMutation(this._bestOpponent);
        }    
    }

    public playTurn(): void {
        this._initialGameWorld.shootCueBall(this._bestOpponent.power, this._bestOpponent.rotation);
    }

    public simulate(): void {
        this._gameWorld.shootCueBall(this._currentOpponent.power, this._currentOpponent.rotation);
    }

    public opponentTrainingLoop(): void {

        while(!this._finishedSession){
            this.train();
            this._gameWorld.update();
        }

        Mouse.reset();

    }

    public startSession(gameWorld: GameWorld): void {
        this._soundOnState = GAME_CONFIG.SOUND_ON;
        GAME_CONFIG.SOUND_ON = false;
        if(gameWorld.isBallInHand) {
            this.placeBallInHand(gameWorld);
        }
        this._initialGameWorld = gameWorld;
        this._gameWorld = cloneDeep(gameWorld);
        this.init();
        this._finishedSession = false;

        this.simulate();
        this.opponentTrainingLoop();
    }
}

export const AI = new AITrainer();