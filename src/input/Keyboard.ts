import { ButtonState } from './button-state';

class Keyboard_Singleton {

    //------Members------//

    _keyStates : ButtonState[] = [];
    
    //------Constructor------//

    constructor() {
        for(let i = 0 ; i < 256 ; i++ ) {
            this._keyStates[i] =  new ButtonState();
        }
        
        document.addEventListener('keyup', (event) => this.handleKeyUp(event));
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    }

    //------Private Methods------//

    private handleKeyUp(event: KeyboardEvent): void {
        this._keyStates[event.keyCode].down = false;
    }

    private handleKeyDown(event: KeyboardEvent): void {
        this._keyStates[event.keyCode].pressed = true;
        this._keyStates[event.keyCode].down = true;
    }

    //------Public Methods------//

    public reset() : void {
        for(let i = 0 ; i < 256 ; i++ ) {
            this._keyStates[i].pressed = false;
        }
    }

    public isDown(keyCode: number): boolean {
        return this._keyStates[keyCode].down;
    }
    
    public isPressed(keyCode: number): boolean {
        return this._keyStates[keyCode].pressed;
    }
}

export const Keyboard = new Keyboard_Singleton();