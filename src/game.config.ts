import { MenuAction } from './menu/MenuAction';
export const GAME_CONFIG : any = {

    // SIZING
    GAME_WIDTH: 1500,
    GAME_HEIGHT: 825,

    // POSITIONS
    RED_BALLS_POSITIONS: [
        { x: 1056, y: 433 },
        { x: 1090, y: 374 },
        { x: 1126, y: 393 },
        { x: 1126, y: 472 },
        { x: 1162, y: 335 },
        { x: 1162, y: 374 },
        { x: 1162, y: 452 },
    ],
    YELLOW_BALLS_POSITIONS: [
        { x: 1022, y: 413 },
        { x: 1056, y: 393 },
        { x: 1090, y: 452 },
        { x: 1126, y: 354 },
        { x: 1126, y: 433 },
        { x: 1162, y: 413 },
        { x: 1162, y: 491 },
    ],
    CUE_BALL_POSITION: { x: 413, y: 413 },
    EIGHT_BALL_POSITION: { x: 1090, y: 413 },
    MATCH_SCORE_POSITIONS: [
        { x: 420, y: 27 },
        { x: 932, y: 27 }
    ],
    MATCH_SCORE_MARGIN: 20,

    OVERALL_SCORE_LABELS_POSITIONS: [
        { x: 628, y: 460 },
        { x: 778, y: 460 },
    ],
    OVERALL_SCORE_LABEL_FONT: '200px Impact',
    OVERALL_SCORE_LABEL_COLOR: '#126736',
    OVERALL_SCORE_LABEL_ALIGNMENT: 'top',

    // ASSETS
    SPRITES_BASE_PATH: 'assets/sprites/',
    SPRITES: {
        MAIN_MENU_BACKGROUND : "main_menu_background.png",
        TABLE : "spr_background4.png",
        CUE_BALL : "spr_ball2.png",
        RED_BALL : "spr_redBall2.png",
        YELLOW_BALL : "spr_yellowBall2.png",
        BLACK_BALL : "spr_blackBall2.png",
        STICK : "spr_stick.png",
        TWO_PLAYERS_BUTTON : "2_players_button.png",
        TWO_PLAYERS_BUTTON_HOVERED : "2_players_button_hover.png",
        ONE_PLAYER_BUTTON : "1_player_button.png",
        ONE_PLAYER_BUTTON_HOVERED : "1_player_button_hover.png",
        MUTE_BUTTON : "mute_button.png",
        MUTE_BUTTON_HOVERED : "mute_button_hover.png",
        MUTE_BUTTON_PRESSED : "mute_button_pressed.png",
        MUTE_BUTTON_PRESSED_HOVERED : "mute_button_pressed_hover.png",
        EASY_BUTTON : "easy_button.png",
        EASY_BUTTON_HOVERED : "easy_button_hover.png",
        MEDIUM_BUTTON : "medium_button.png",
        MEDIUM_BUTTON_HOVERED : "medium_button_hover.png",
        HARD_BUTTON : "hard_button.png",
        HARD_BUTTON_HOVERED : "hard_button_hover.png",
        BACK_BUTTON : "back_button.png",
        BACK_BUTTON_HOVERED : "back_button_hover.png",
        CONTINUE_BUTTON : "continue_button.png",
        CONTINUE_BUTTON_HOVERED : "continue_button_hover.png",
        INSANE_BUTTON : "insane_button.png",
        INSANE_BUTTON_HOVERED : "insane_button_hover.png",
        ABOUT_BUTTON : "about_button.png",
        ABOUT_BUTTON_HOVERED : "about_button_hover.png",
        CONTROLS : "controls.png",
        RED_SCORE: "red_score.png",
        YELLOW_SCORE: "yellow_score.png",
    },
    SOUNDS_BASE_PATH: 'assets/sounds/',
    SOUNDS: {
        BALLS_COLLIDE: "BallsCollide.wav",
        STRIKE: "Strike.wav",
        RAIL: "Hole.wav",
        // Bossa Antigua Kevin MacLeod (incompetech.com)
        // Licensed under Creative Commons: By Attribution 3.0 License
        // http://creativecommons.org/licenses/by/3.0/
        MUSIC: "Bossa Antigua.mp3"
    },

    // PHYSICS
    FRICTION: 0.0208,
    COLLISION_LOSS: 0.0208,

    // TABLE
    CUSHION_WIDTH: 57,
    POCKET_RADIUS: 48,
    POCKETS_POSITIONS: [
        { x: 62, y: 62 },
        { x: 750, y: 32 },
        { x: 1435, y: 62 },
        { x: 62, y: 762 },
        { x: 750, y: 794 },
        { x: 1435, y: 762 },
    ],

    // LABELS
    CURRENT_PLAYER_LABEL_POSITION: { x: 640, y: 260},
    CURRENT_PLAYER_LABEL_COLOR: '#126736',
    CURRENT_PLAYER_LABEL: 'PLAYER ',
    CURRENT_PLAYER_LABEL_FONT: '70px Impact',
    CURRENT_PLAYER_LABEL_ALIGNMENT: 'top',

    // BALL
    BALL_DIAMETER: 38,
    BALL_ORIGIN: { x: 25, y: 25 },
    BALL_MIN_VELOCITY_LENGTH: 0.05,
    MAX_BALL_EXPECTED_VELOCITY: 200,
    MAX_BALL_EXPECTED_COLLISION_FORCE: 100,

    // STICK
    STICK_ORIGIN: { x: 970, y: 11 },
    STICK_SHOT_ORIGIN: { x: 950, y: 11 },
    POWER_TO_ADD_PER_FRAME: 1,
    STICK_MOVEMENT_PER_FRAME: 2,
    STICK_MAX_POWER: 65,

    // KEYS
    SELECT_MOUSE_BUTTON: 0,
    SHOOT_MOUSE_BUTTON: 0,
    PLACE_BALL_IN_HAND_MOUSE_BUTTON: 0,
    INCREASE_SHOT_POWER_KEY: 87,
    DECREASE_SHOT_POWER_KEY: 83,
    BACK_TO_MENU_KEY: 27,

    // TIMING
    TIMEOUT_TO_HIDE_STICK_AFTER_SHOT: 500,
    TIMOUT_TO_HIDE_BALL_AFTER_POCKET: 100,
    LOADING_SCREEN_TIMEOUT: 5000,

    // MENU
    MAIN_MENU_LABELS: [
        {
            text: 'Classic 8-Ball',
            position: { x: 100, y: 100 },
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
    MAIN_MENU_BUTTONS: [
        { 
            action: MenuAction.PVP,
            position: { x: 200, y: 200 },
            sprite: 'TWO_PLAYERS_BUTTON', 
            spriteOnHover: 'TWO_PLAYERS_BUTTON_HOVERED', 
            spriteOnPressed: null 
        },
        { 
            action: MenuAction.PVC,
            position: { x: 200, y: 400 },
            sprite: 'ONE_PLAYER_BUTTON', 
            spriteOnHover: 'ONE_PLAYER_BUTTON_HOVERED', 
            spriteOnPressed: null 
        },
        { 
            action: MenuAction.ToggleSound,
            position: { x: 1430, y: 10 },
            sprite: 'MUTE_BUTTON', 
            spriteOnHover: 'MUTE_BUTTON_HOVERED', 
            spriteOnPressed: 'MUTE_BUTTON_PRESSED' 
        },
    ],
    DEFAULT_CURSOR: 'default',
    BUTTON_CURSOR: 'pointer',

    // LOADING SCREEN
    LOADING_SCREEN_IMAGE_POSITION: { x: 450, y: 112.5 },

    SOUND_ON: true,
};
