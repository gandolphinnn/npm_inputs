import { Singleton, clamp, coalesce } from '@gandolphinnn/utils';
import { Coord, MainCanvas } from '@gandolphinnn/graphics2';

//#region Enum, Constants
export enum BtnState {
	Up, Down, Released, Hold, Dbl
}
export const MS_DELAY_DOWNDBL_HOLD = 300;
export const MS_DELAY_RELEASED_UP = 300;
const EVENT_BTNSTATE = { //! NO EXPORT
	[BtnState.Up]: [BtnState.Up, BtnState.Released],
	[BtnState.Down]: [BtnState.Down, BtnState.Hold, BtnState.Dbl]
}
//#endregion

//#region Classes
export class Button {
	private _state: BtnState;
	private lastTimeStamp: number;
	get state() {
		if (getCurrentTimeStamp() - this.lastTimeStamp >= MS_DELAY_DOWNDBL_HOLD && (this._state == BtnState.Down || this._state == BtnState.Dbl))
			this._state = BtnState.Hold;

		if (getCurrentTimeStamp() - this.lastTimeStamp >= MS_DELAY_RELEASED_UP && this._state == BtnState.Released)
			this._state = BtnState.Up;

		return this._state;
	}
	private set state(state: BtnState) {
		this.lastTimeStamp = getCurrentTimeStamp();
		this._state = state;
	}
	constructor() {
		this.state = BtnState.Up;
	}
	toggle(newState: BtnState.Up | BtnState.Down) {
		const currentState = this.state; //? MUST PICK the getter
		if (EVENT_BTNSTATE[newState].indexOf(currentState) != -1) {
			return;
		}
		switch (currentState) {
			case BtnState.Up:		this.state = BtnState.Down;		break;
			case BtnState.Down:		this.state = BtnState.Released;	break;
			case BtnState.Released:	this.state = BtnState.Dbl;		break;
			case BtnState.Hold:		this.state = BtnState.Up;		break;
			case BtnState.Dbl:		this.state = BtnState.Released;	break;
		}
	}
}
export class Input extends Singleton {
	private static get get() { return this.singletonInstance as Input }

	private _mouse: { pos: Coord, wheel: {x: number, y: number}, btn: Record<number, Button> }
	private _keys: Record<string, Button>;

	notPreventedCodes: string[];

	constructor() {
		super();
		this._mouse = {pos: new Coord(0,0), wheel: {x: 0, y: 0}, btn: {}};
		this._keys = {};
		this.notPreventedCodes = ['F5', 'F12'];

		MainCanvas.get.cnv.addEventListener('contextmenu', e => e.preventDefault()); //? prevent right click menu
		MainCanvas.get.cnv.addEventListener('mousemove', e => {
			Input.get._mouse.pos = new Coord(e.clientX, e.clientY);
		});
		//TODO figure out how to reset the wheel object
		MainCanvas.get.cnv.addEventListener('wheel', e => {
			e.preventDefault();
			Input.get._mouse.wheel.x = clamp(e.deltaX, -1, 1) +1 -1;
			Input.get._mouse.wheel.y = clamp(e.deltaY, -1, 1) +1 -1;
		}, {passive: false}); //? passive -> https://chromestatus.com/feature/6662647093133312
		MainCanvas.get.cnv.addEventListener('mousedown', e => {
			/*this.preventeDefault(e);
			Input.get._mouse.btn[e.button] = BtnState.Down;*/
		})
		MainCanvas.get.cnv.addEventListener('mouseup', e => {
			//Input.get._mouse.btn[e.button] = BtnState.Up;
		})
		MainCanvas.get.cnv.addEventListener('keydown', e => {
			const code = replaceKeyCode(e.code);

			if (this.notPreventedCodes.indexOf(code) == -1)
				e.preventDefault()

			this.toggleKey(code, BtnState.Down);
		});
		MainCanvas.get.cnv.addEventListener('keyup', e => {
			const code = replaceKeyCode(e.code);
			this.toggleKey(code, BtnState.Up);
		});
	}
	private toggleKey(code: string, newState: BtnState.Up | BtnState.Down) {
		if (Input.get._keys[code] === undefined)
			Input.get._keys[code] = new Button();

		Input.get._keys[code].toggle(newState);
	}
	static mousePos() {
		return Input.get._mouse.pos.copy();
	}
	static mouseWheel() {
		//? close, but this is faster than the event
		const wheel = {...Input.get._mouse.wheel} as {x: number, y: number};
		return wheel;
	}
	static mouseBtnState(btnIndex: number) {
		return Input.get._mouse.btn[btnIndex].state;
	}
	static keyState(keyCode: string) {
		if (Input.get._keys[keyCode] === undefined)
			Input.get._keys[keyCode] = new Button();

		return Input.get._keys[keyCode].state;
	}
}
//#endregion

//#region Functions
export function replaceKeyCode(code: string) {
	return code.replace('Key', 'K').replace('Digit', 'D').replace('Numpad', 'P').replace('Arrow', '');
}
export function getCurrentTimeStamp() {
	const date = new Date()
	return ((date.getHours() * 60 + date.getMinutes())*60+date.getSeconds())*1000 + date.getMilliseconds();
}
//#endregion