import { MenuActionType } from './menu/menu-action-type';
import { IGameConfig } from './game.config.type';

export const GameConfig : IGameConfig = {

    gameSize: { x: 1500, y: 825 },

    soundOn: true,

    timeoutToHideStickAfterShot: 500,

    timeoutToHideBallAfterPocket: 100,

    loadingScreenTimeout: 5000,

    loadingScreenImagePosition: { x: 450, y: 112.5 },

    timeoutToLoadSubMenu: 100,

    labels: {
        currentPlayer: {
            position: { x: 640, y: 260},
            color: '#126736',
            font: '70px Impact',
            alignment: 'top',
            text: 'PLAYER ',
        },
        overalScores: [
            {
                position: { x: 628, y: 460 },
                color: '#126736',
                font: '200px Impact',
                alignment: 'top'
            },
            {
                position: { x: 778, y: 460 },
                color: '#126736',
                font: '200px Impact',
                alignment: 'top'
            }
        ]
    },

    redBallsPositions: [
        { x: 1056, y: 433 },
        { x: 1090, y: 374 },
        { x: 1126, y: 393 },
        { x: 1126, y: 472 },
        { x: 1162, y: 335 },
        { x: 1162, y: 374 },
        { x: 1162, y: 452 },
    ],

    yellowBallsPositions: [
        { x: 1022, y: 413 },
        { x: 1056, y: 393 },
        { x: 1090, y: 452 },
        { x: 1126, y: 354 },
        { x: 1126, y: 433 },
        { x: 1162, y: 413 },
        { x: 1162, y: 491 },
    ],

    cueBallPosition: { x: 413, y: 413 },

    eightBallPosition: { x: 1090, y: 413 },

    matchScore: {
        scoresPositions: [
            { x: 420, y: 27 },
            { x: 932, y: 27 }
        ],
        unitMargin: 20
    },

    sprites: {
        basePath: 'assets/sprites/',
        paths: {
            menuBackground : 'main_menu_background.png',
            table : 'spr_background4.png',
            cueBall : 'spr_ball2.png',
            redBall : 'spr_redBall2.png',
            yellowBall : 'spr_yellowBall2.png',
            blackBall : 'spr_blackBall2.png',
            stick : 'spr_stick.png',
            twoPlayersButton : '2_players_button.png',
            twoPlayersButtonHovered : '2_players_button_hover.png',
            onePlayerButton : '1_player_button.png',
            onePlayerButtonHovered : '1_player_button_hover.png',
            muteButton : 'mute_button.png',
            muteButtonHovered : 'mute_button_hover.png',
            muteButtonPressed : 'mute_button_pressed.png',
            muteButtonPressedHovered : 'mute_button_pressed_hover.png',
            easyButton : 'easy_button.png',
            easyButtonHovered : 'easy_button_hover.png',
            mediumButton : 'medium_button.png',
            mediumButtonHovered : 'medium_button_hover.png',
            hardButton : 'hard_button.png',
            hardButtonHovered : 'hard_button_hover.png',
            backButton : 'back_button.png',
            backButtonHovered : 'back_button_hover.png',
            continueButton : 'continue_button.png',
            continueButtonHovered : 'continue_button_hover.png',
            insaneButton : 'insane_button.png',
            insaneButtonHovered : 'insane_button_hover.png',
            controls : 'controls.png',
            redScore: 'red_score.png',
            yellowScore: 'yellow_score.png'
        }
    },

    sounds: {
        basePath: 'assets/sounds/',
        paths: {
            ballsCollide: 'BallsCollide.wav',
            strike: 'Strike.wav',
            rail: 'Hole.wav',
        }
    },

    physics: {
        friction: 0.018,
        collisionLoss: 0.018,
    },

    table: {
        cushionWidth: 57,
        pocketRadius: 48,
        pocketsPositions: [
            { x: 62, y: 62 },
            { x: 750, y: 32 },
            { x: 1435, y: 62 },
            { x: 62, y: 762 },
            { x: 750, y: 794 },
            { x: 1435, y: 762 }
        ]
    },

    ball: {
        diameter: 38,
        origin: { x: 25, y: 25 },
        minVelocityLength: 0.05,
        maxExpectedVelocity: 120,
        maxExpectedCollisionForce: 70
    },

    stick: {
        origin: { x: 970, y: 11 },
        shotOrigin: { x: 950, y: 11 },
        powerToAddPerFrame: 1,
        movementPerFrame: 3,
        maxPower: 50
    },

    input: {
        mouseSelectButton: 0,
        mouseShootButton: 0,
        mousePlaceBallButton: 0,
        increaseShotPowerKey: 87,
        decreaseShotPowerKey: 83,
        toggleMenuKey: 27
    },

    mainMenu : {
        
        labels: [
            {
                text: 'Classic 8-Ball',
                position: { x: 200, y: 100 },
                font: '100px Bookman',
                color: 'white',
                alignment: 'left',
            },
            {
                text: `© ${new Date().getFullYear()} Chen Shmilovich`,
                position: { x: 1250, y: 800 },
                font: '20px Bookman',
                color: 'white',
                alignment: 'left',
            }
        ],

        buttons: [
            { 
                action: MenuActionType.PVP,
                position: { x: 200, y: 200 },
                sprite: 'twoPlayersButton', 
                spriteOnHover: 'twoPlayersButtonHovered', 
            },
            { 
                action: MenuActionType.GoToSubMenu,
                value: 0,
                position: { x: 200, y: 400 },
                sprite: 'onePlayerButton', 
                spriteOnHover: 'onePlayerButtonHovered', 
            },
            { 
                action: MenuActionType.ToggleSound,
                position: { x: 1430, y: 10 },
                sprite: 'muteButton', 
                spriteOnHover: 'muteButtonHovered', 
            },
        ],

        subMenus: [
            {
                
                labels: [
                    {
                        text: 'Choose Difficulty',
                        position: { x: 200, y: 80 },
                        font: '70px Bookman',
                        color: 'white',
                        alignment: 'left',
                    },
                    {
                        text: `© ${new Date().getFullYear()} Chen Shmilovich`,
                        position: { x: 1250, y: 800 },
                        font: '20px Bookman',
                        color: 'white',
                        alignment: 'left',
                    }
                ],

                buttons: [
                    {
                        action: MenuActionType.GoToPreviousMenu,
                        position: { x: 100, y: 150 },
                        sprite: 'backButton', 
                        spriteOnHover: 'backButtonHovered', 
                    },
                    {
                        action: MenuActionType.PVC,
                        position: { x: 200, y: 150 },
                        value: 30,
                        sprite: 'easyButton',
                        spriteOnHover: 'easyButtonHovered'
                    },
                    {
                        action: MenuActionType.PVC,
                        position: { x: 200, y: 300 },
                        value: 50,
                        sprite: 'mediumButton',
                        spriteOnHover: 'mediumButtonHovered'
                    },
                    {
                        action: MenuActionType.PVC,
                        position: { x: 200, y: 450 },
                        value: 100,
                        sprite: 'hardButton',
                        spriteOnHover: 'hardButtonHovered'
                    },
                    {
                        action: MenuActionType.PVC,
                        position: { x: 200, y: 600 },
                        value: 700,
                        sprite: 'insaneButton',
                        spriteOnHover: 'insaneButtonHovered'
                    },
                    { 
                        action: MenuActionType.ToggleSound,
                        position: { x: 1430, y: 10 },
                        sprite: 'muteButton', 
                        spriteOnHover: 'muteButtonHovered', 
                    },
                ],

                subMenus: []
            }
        ]
    },
    
    cursor: {
        default: 'default',
        button: 'pointer'
    },

    ai: {
        on: true,
        trainIterations: 30,
        playerIndex: 1,
        ballDistanceBonus: 1/5800,
        validTurnBonus: 5000,
        pocketedBallBonus: 2000,
        invalidTurnPenalty: 3000,
        gameWonBonus: 50000,
        gameLossPenalty: 50000,
        shotPowerMutationVariance: 15,
        minShotPower: 10,
    },
};
