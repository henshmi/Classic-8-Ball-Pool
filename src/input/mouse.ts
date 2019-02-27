import { ButtonState } from './button-state';
import { Canvas2D } from '../canvas';
import { Vector2 } from '../geom/vector2';

class Mouse_Singleton {

    //------Members------//

    private _buttonStates: ButtonState[] = [];
    private _position: Vector2;

    //------Properties------//

    public get position() {
        return Vector2.copy(this._position);
    }

    //------Constructor------//

    constructor() {

        for(let i = 0 ; i < 3 ; i ++ ) {
            this._buttonStates[i] = new ButtonState();
        }

        this._position = Vector2.zero;

        document.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        document.addEventListener('mousedown', (event) => this.handleMouseDown(event));
        document.addEventListener('mouseup', (event) => this.handleMouseUp(event));
    }

    //------Private Methods------//

    private handleMouseMove(event: MouseEvent): void {
        const mouseX: number = (event.pageX - Canvas2D.offsetX) / Canvas2D.scaleX;
        const mouseY: number = (event.pageY - Canvas2D.offsetY) / Canvas2D.scaleY;
        this._position = new Vector2(mouseX, mouseY);
    }

    private handleMouseDown(event: MouseEvent) {
        this._buttonStates[event.button].down = true;
        this._buttonStates[event.button].pressed = true;
    }

    private handleMouseUp(event: MouseEvent) {
        this._buttonStates[event.button].down = false;
    }

    //------Public Methods------//

    public reset() : void {
        for(let i = 0 ; i < 3 ; i++ ) {
            this._buttonStates[i].pressed = false;
        }
    }

    public isDown(button: number): boolean {
        return this._buttonStates[button].down;
    }
    
    public isPressed(button: number): boolean {
        return this._buttonStates[button].pressed;
    }
}

export const Mouse = new Mouse_Singleton();