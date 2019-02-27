import { MenuActionType } from './menu/menu-action-type';

export interface IGameConfig {
    gameSize:                     IVector2;
    soundOn:                      boolean;
    timeoutToHideStickAfterShot:  number;
    timeoutToHideBallAfterPocket: number;
    loadingScreenTimeout:         number;
    timeoutToLoadSubMenu:         number;
    loadingScreenImagePosition:   IVector2;
    labels:                       ILabelsConfig;
    redBallsPositions:            IVector2[];
    yellowBallsPositions:         IVector2[];
    cueBallPosition:              IVector2;
    eightBallPosition:            IVector2;
    matchScore:                   IMatchScoreConfig;
    sprites:                      IAssetsConfig;
    sounds:                       IAssetsConfig;
    physics:                      IPhysicsConfig;
    table:                        ITableConfig;
    ball:                         IBallConfig;
    stick:                        IStickConfig;
    input:                        IInputConfig;
    mainMenu:                     IMenuConfig;
    cursor:                       ICursorConfig;
    ai:                           IAIConfig;
}

export interface IVector2 {
    x: number;
    y: number;
}

export interface ILabelsConfig {
    currentPlayer: ILabel;
    overalScores:  ILabel[];
}

export interface IMatchScoreConfig {
    scoresPositions: IVector2[];
    unitMargin:      number;
}

export interface IAssetsConfig {
    basePath: string;
    paths:    { [key: string]: string };
}

export interface IPhysicsConfig {
    friction:      number;
    collisionLoss: number;
}

export interface ITableConfig {
    cushionWidth:     number,
    pocketRadius:     number,
    pocketsPositions: IVector2[]
}

export interface IBallConfig {
    diameter:                  number;
    origin:                    IVector2;
    minVelocityLength:         number;
    maxExpectedVelocity:       number;
    maxExpectedCollisionForce: number;
}

export interface IStickConfig {
    origin:             IVector2,
    shotOrigin:         IVector2,
    powerToAddPerFrame: number,
    movementPerFrame:   number,
    maxPower:           number
}

export interface IInputConfig {
    mouseSelectButton:    number;
    mouseShootButton:     number;
    mousePlaceBallButton: number;
    increaseShotPowerKey: number;
    decreaseShotPowerKey: number;
    toggleMenuKey:        number;
}

export interface IMenuConfig {
    labels:   ILabel[];
    buttons:  IButton[];
    subMenus: IMenuConfig[];
}

export interface IButton {
    action:        MenuActionType;
    position:      IVector2;
    sprite:        string;
    spriteOnHover: string;
    value?:        number;
}

export interface ILabel {
    position:  IVector2;
    font:      string;
    color:     string;
    alignment: string;
    text?:     string;
}

export interface ICursorConfig {
    default: string,
    button:  string,
}
export interface IAIConfig {
    on:                        boolean;
    trainIterations:           number;
    playerIndex:               number;
    ballDistanceBonus:         number;
    validTurnBonus:            number;
    pocketedBallBonus:         number;
    invalidTurnPenalty:        number;
    gameWonBonus:              number;
    gameLossPenalty:           number;
    shotPowerMutationVariance: number;
    minShotPower:              number;
}
