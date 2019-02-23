import { IMenuCommand } from './menu-command';
import { GAME_CONFIG } from '../../game.config';

export class ToggleSoundCommand implements IMenuCommand {
    
    private toggleMuteButtonSprite(): void {
        const currentMuteButtonPath: string = GAME_CONFIG.SPRITES.MUTE_BUTTON;
        const currentMuteButtonHoveredPath: string = GAME_CONFIG.SPRITES.MUTE_BUTTON_HOVERED;
        GAME_CONFIG.SPRITES.MUTE_BUTTON = GAME_CONFIG.SPRITES.MUTE_BUTTON_PRESSED;
        GAME_CONFIG.SPRITES.MUTE_BUTTON_HOVERED = GAME_CONFIG.SPRITES.MUTE_BUTTON_PRESSED_HOVERED;
        GAME_CONFIG.SPRITES.MUTE_BUTTON_PRESSED = currentMuteButtonPath;
        GAME_CONFIG.SPRITES.MUTE_BUTTON_PRESSED_HOVERED = currentMuteButtonHoveredPath;
    }
    public execute(): void {
        GAME_CONFIG.SOUND_ON = !GAME_CONFIG.SOUND_ON;
        this.toggleMuteButtonSprite();
    }

}