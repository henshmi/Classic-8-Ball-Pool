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
    },
    AUDIO_BASE_PATH: 'assets/sounds/',

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

    // BALL
    BALL_DIAMETER: 38,
    BALL_ORIGIN: { x: 25, y: 25 },
    BALL_MIN_VELOCITY_LENGTH: 0.05,

    // STICK
    STICK_ORIGIN: { x: 970, y: 11 },
    STICK_SHOT_ORIGIN: { x: 950, y: 11 },
    POWER_TO_ADD_PER_FRAME: 1,
    STICK_MOVEMENT_PER_FRAME: 2,
    STICK_MAX_POWER: 70,

    // KEYS
    SHOOT_MOUSE_BUTTON: 0,
    INCREASE_SHOT_POWER_KEY: 87,
    DECREASE_SHOT_POWER_KEY: 83,

    // TIMING
    TIMEOUT_TO_HIDE_STICK_AFTER_SHOT: 500,
    TIMOUT_TO_HIDE_BALL_AFTER_POCKET: 100,
};
