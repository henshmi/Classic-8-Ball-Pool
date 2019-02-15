import { GAME_CONFIG } from './game.config';

class Assets_Singleton {

    sprites: Map<string, HTMLImageElement>;

    constructor() {
        this.sprites = new Map<string, HTMLImageElement>();
    }

    public async loadGameAssets(): Promise<void> {
        await this.loadGameSprites();
    }

    public getSprite(key: string): HTMLImageElement{
        return this.sprites.get(key);
    }

    private loadSprite(path: string): Promise<void> {
        const img = new Image();
        this.sprites.set(path, img);

        return new Promise(resolve => {
            img.onload = () => resolve();
            img.src = GAME_CONFIG.SPRITES_BASE_PATH + path;
        });
    }
    
    private async loadGameSprites(): Promise<void> {
        const loadPromises = Object.values(GAME_CONFIG.SPRITES).map(this.loadSprite.bind(this));

        await Promise.all(loadPromises);
    }

}

export const Assets = new Assets_Singleton();