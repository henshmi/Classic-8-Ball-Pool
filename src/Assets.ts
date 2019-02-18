import { GAME_CONFIG } from './game.config';

class Assets_Singleton {

    _sprites: Map<string, HTMLImageElement>;
    _sounds: Map<string, HTMLAudioElement>;

    constructor() {
        this._sprites = new Map<string, HTMLImageElement>();
        this._sounds = new Map<string, HTMLAudioElement>();
    }

    public async loadGameAssets(): Promise<void> {
        await this.loadGameSprites();
        await this.loadGameSounds();
    }

    public getSprite(key: string): HTMLImageElement {
        return this._sprites.get(key);
    }

    public getSound(key: string): HTMLAudioElement {
        return this._sounds.get(key).cloneNode(true) as HTMLAudioElement;
    }

    public playSound(key: string, volume: number): void {
        const sound = this.getSound(key);
        sound.volume = volume;
        sound.play();
    }

    private loadSprite(path: string): Promise<void> {
        const img = new Image();
        this._sprites.set(path, img);

        return new Promise(resolve => {
            img.onload = () => resolve();
            img.src = GAME_CONFIG.SPRITES_BASE_PATH + path;
        });
    }
    
    private async loadGameSprites(): Promise<void> {
        const loadPromises = Object.values(GAME_CONFIG.SPRITES).map(this.loadSprite.bind(this));

        await Promise.all(loadPromises);
    }

    private loadSound(path: string): Promise<void> {
        const audio: HTMLAudioElement = new Audio();
        this._sounds.set(path, audio);

        return new Promise(resolve => {
            audio.src = GAME_CONFIG.SOUNDS_BASE_PATH + path;
            resolve();
        });
    }

    private async loadGameSounds(): Promise<void> {
        const loadPromises = Object.values(GAME_CONFIG.SOUNDS).map(this.loadSound.bind(this));
        
        await Promise.all(loadPromises);
    }

}

export const Assets = new Assets_Singleton();