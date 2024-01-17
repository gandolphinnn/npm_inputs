import { Singleton, clamp, coalesce } from '@gandolphinnn/utils';
import { Coord } from '@gandolphinnn/graphics2';

const MS_DELAY_DOWNDBL_HOLD = 750;
const MS_DELAY_RELEASED_UP = 750;
enum BtnState {
	Up, Down, Released, Hold, Dbl
}
class Button {
	private _state: BtnState;
	private lastTimeStamp: number;
	get state() { //TODO this getter update the state based on the last update
		//TODO TEST THIS
		if (getCurrentTimeStamp() - this.lastTimeStamp >= MS_DELAY_DOWNDBL_HOLD && (this._state == BtnState.Down || this._state == BtnState.Dbl)) {
			this._state = BtnState.Hold;
		}
		if (getCurrentTimeStamp() - this.lastTimeStamp >= MS_DELAY_RELEASED_UP && this._state == BtnState.Released) {
			this._state = BtnState.Up;
		}
		return this._state
	}
	private set state(state: BtnState) {
		this.lastTimeStamp = getCurrentTimeStamp();
	}
	setState(state: BtnState.Up | BtnState.Down ) {
		const currentState = this.state; //? MUST PICK the getter
		switch (currentState) {
			case BtnState.Up:		this.state = BtnState.Down;		break;
			case BtnState.Down:		this.state = BtnState.Released;	break;
			case BtnState.Released:	this.state = BtnState.Dbl;		break;
			case BtnState.Hold:		this.state = BtnState.Up;		break;
			case BtnState.Dbl:		this.state = BtnState.Released;	break;
			default: break;
		}
	}
}
export class Input extends Singleton {
	private static get get() { return this.singletonInstance as Input }

	private _mouse: { pos: Coord, wheel: Coord, btn: Record<number, Button> }
	private _key: Record<string, Button>;

	preventDef: boolean;
	allowF5F12: boolean;

	constructor() {
		super();
		this._mouse = {pos: new Coord(0,0), wheel: new Coord(0, 0), btn: {}};
		this._key = {};
		this.preventDef = true;
		this.allowF5F12 = true;

		document.addEventListener('contextmenu', e => this.preventeDefault(e)); //? prevent right click menu
		document.addEventListener('mousemove', e => {
			Input.get._mouse.pos = new Coord(e.clientX, e.clientY);
		});
		document.addEventListener('wheel', e => {
			this.preventeDefault(e);
			//TODO turn -0 in 0
			Input.get._mouse.wheel = new Coord(clamp(e.deltaX, -1, 1), clamp(e.deltaY, -1, 1));
		});
		document.addEventListener('mousedown', e => {
			/*this.preventeDefault(e);
			Input.get._mouse.btn[e.button] = BtnState.Down;*/
		})
		document.addEventListener('mouseup', e => {
			//Input.get._mouse.btn[e.button] = BtnState.Up;
		})
		document.addEventListener('keydown', e => {
			if (!(this.allowF5F12 && (e.code == 'F5' || e.code == 'F12'))) //TODO clean this condition
				this.preventeDefault(e) //? allow to refresh and to open the page inspect

			const code = replaceKeyCode(e.code);
			this.changeBtnState(code, 1);
			console.log(Input.get._key[code].state);
		});
		document.addEventListener('keyup', e => {
			const code = replaceKeyCode(e.code);
			this.changeBtnState(code, 0);
			console.log(Input.get._key[code].state);
		});
	}
	private preventeDefault(e: Event) {
		if (this.preventDef)
			e.preventDefault();
	}
	private changeBtnState(code: string, isDown: 0 | 1) {
		const currentVal = coalesce(Input.get._key[code], BtnState.Up) as BtnState
		Input.get._key[code];
	}
	static mousePos() {
		return Input.get._mouse.pos.copy();
	}
	static mouseBtnState(btnIndex: number) {
		return Input.get._mouse.btn[btnIndex];
	}
	static inputSamples() {
		//TODO 
	}
}
export function getTimeStamp() {
	return new Date().getMilliseconds();
}
export function replaceKeyCode(code: string) {
	return code.replace('Key', 'K').replace('Digit', 'D').replace('Numpad', 'P').replace('Arrow', '');
}
export function getCurrentTimeStamp() {
	const date = new Date()
	return ((date.getHours() * 60 + date.getMinutes())*60+date.getSeconds())*1000 + date.getMilliseconds();
}