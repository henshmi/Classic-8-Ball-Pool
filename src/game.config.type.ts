import { MenuActionType } from './menu/menu-action-type';

export interface GameConfig {
    GAME_WIDTH:                        number;
    GAME_HEIGHT:                       number;
    RED_BALLS_POSITIONS:               Position[];
    YELLOW_BALLS_POSITIONS:            Position[];
    CUE_BALL_POSITION:                 Position;
    EIGHT_BALL_POSITION:               Position;
    MATCH_SCORE_POSITIONS:             Position[];
    MATCH_SCORE_MARGIN:                number;
    SPRITES_BASE_PATH:                 string;
    SPRITES:                           { [key: string]: string };
    SOUNDS_BASE_PATH:                  string;
    SOUNDS:                            { [key: string]: string };
    FRICTION:                          number;
    COLLISION_LOSS:                    number;
    CUSHION_WIDTH:                     number;
    POCKET_RADIUS:                     number;
    POCKETS_POSITIONS:                 Position[];
    CURRENT_PLAYER_LABEL_POSITION:     Position;
    CURRENT_PLAYER_LABEL_COLOR:        string;
    CURRENT_PLAYER_LABEL:              string;
    CURRENT_PLAYER_LABEL_FONT:         string;
    CURRENT_PLAYER_LABEL_ALIGNMENT:    string;
    OVERALL_SCORE_LABELS_POSITIONS:    Position[];
    OVERALL_SCORE_LABEL_FONT:          string;
    OVERALL_SCORE_LABEL_COLOR:         string;
    OVERALL_SCORE_LABEL_ALIGNMENT:     string;
    BALL_DIAMETER:                     number;
    BALL_ORIGIN:                       Position;
    BALL_MIN_VELOCITY_LENGTH:          number;
    MAX_BALL_EXPECTED_VELOCITY:        number;
    MAX_BALL_EXPECTED_COLLISION_FORCE: number;
    STICK_ORIGIN:                      Position;
    STICK_SHOT_ORIGIN:                 Position;
    POWER_TO_ADD_PER_FRAME:            number;
    STICK_MOVEMENT_PER_FRAME:          number;
    STICK_MAX_POWER:                   number;
    SELECT_MOUSE_BUTTON:               number;
    SHOOT_MOUSE_BUTTON:                number;
    PLACE_BALL_IN_HAND_MOUSE_BUTTON:   number;
    INCREASE_SHOT_POWER_KEY:           number;
    DECREASE_SHOT_POWER_KEY:           number;
    BACK_TO_MENU_KEY:                  number;
    TIMEOUT_TO_HIDE_STICK_AFTER_SHOT:  number;
    TIMOUT_TO_HIDE_BALL_AFTER_POCKET:  number;
    LOADING_SCREEN_TIMEOUT:            number;
    TIMEOUT_TO_LOAD_SUBMENU:              number;
    MAIN_MENU_CONFIG:                  MenuConfig;
    DEFAULT_CURSOR:                    string;
    BUTTON_CURSOR:                     string;
    LOADING_SCREEN_IMAGE_POSITION:     Position;
    SOUND_ON:                          boolean;
    AI_ON:                             boolean;
    AI_TRAIN_ITERATIONS:               number;
    AI_PLAYER_INDEX:                   number;
    AI_BALL_DISTANCE_BONUS:            number;
    AI_VALID_TURN_BONUS:               number;
    AI_POCKETED_BALLS_BONUS:           number;
    AI_INVLID_TURN_PENALTY:            number;
    AI_GAME_WON_BONUS:                 number;
    AI_GAME_LOSS_PENALTY:              number;
    AI_SHOT_POWER_MUTATION_VARIANCE:   number;
    AI_MIN_SHOT_POWER:                 number;
}

export interface Position {
    x: number;
    y: number;
}

export interface MenuConfig {
    LABELS:    Label[];
    BUTTONS:   Button[];
    SUB_MENUS: MenuConfig[];
}

export interface Button {
    action:        MenuActionType;
    position:      Position;
    sprite:        string;
    spriteOnHover: string;
    value?:        number;
}

export interface Label {
    text:      string;
    position:  Position;
    font:      string;
    color:     string;
    alignment: string;
}
