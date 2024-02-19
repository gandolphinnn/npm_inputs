import { Singleton, clamp, coalesce } from '@gandolphinnn/utils';
import { Coord, MainCanvas } from '@gandolphinnn/graphics2';

//#region Enum, Constants
export enum BtnState {
	Up, Down, Released, Hold, Dbl
}
export type WheelState = 0 | 1 | -1;
export type KeyCode = 'Backspace' | 'Tab' | 'Enter' | 'ShiftLeft' | 'ShiftRight' | 'ControlLeft' | 'ControlRight' | 'AltLeft' | 'AltRight' | 'Pause' | 'CapsLock' | 'Escape' | 'Space' | 'PageUp' | 'PageDown' | 'End' | 'Home' | 'Left' | 'Up' | 'Right' | 'Down' | 'PrintScreen' | 'Insert' | 'Delete' | 'D0' | 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8' | 'D9' | 'Quote' | 'KA' | 'KB' | 'KC' | 'KD' | 'KE' | 'KF' | 'KG' | 'KH' | 'KI' | 'KJ' | 'KK' | 'KL' | 'KM' | 'KN' | 'KO' | 'KP' | 'KQ' | 'KR' | 'KS' | 'KT' | 'KU' | 'KV' | 'KW' | 'KX' | 'KY' | 'KZ' | 'MetaLeft' | 'MetaRight' | 'ContextMenu' | 'P0' | 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7' | 'P8' | 'P9' | 'PMultiply' | 'PAdd' | 'PSubtract' | 'PDecimal' | 'PDivide' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'F10' | 'F11' | 'F12' | 'NumLock' | 'ScrollLock' | 'Semicolon' | 'Equal' | 'Comma' | 'Minus' | 'Period' | 'Slash' | 'Backquote' | 'BracketLeft' | 'Backslash' | 'BracketRight'

export const MS_DELAY_BTN = {
	[BtnState.Up]: 300, //? Delay from Button.Released to Button.Up
	[BtnState.Down]: 400 //? Delay from Button.Down or Button.Dbl to Button.Hold
}
export const MS_DELAY_WHEEL_RESET: number = 300; //? Delay from Wheel.x or Wheel.y == -1 or 1 to == 0

const EVENT_BTNSTATE = {
	[BtnState.Up]: [BtnState.Up, BtnState.Released],
	[BtnState.Down]: [BtnState.Down, BtnState.Hold, BtnState.Dbl]
}
//#endregion

//#region Classes
//todo i stil dont know if this class is useful
class Timer {
	protected _timeStamp: number;
	protected get elapsed() {
		return getTodayTimeStamp() - this._timeStamp;
	}
	constructor() {
		this._timeStamp = getTodayTimeStamp();
	}
}
class WheelAxis extends Timer {
	private _state: WheelState;
	get state() {
		if (this.state !== 0 && this.elapsed >= MS_DELAY_WHEEL_RESET) {
			this.state = 0;
		}
		return this._state;
	}
	private set state(state: WheelState) {
		if (this.state === state) {
			return;
		}
		this._timeStamp = getTodayTimeStamp();
		this._state = state;
	}
	constructor() {
		super();
		this._state = 0;
	}
}
//todo extends Timer
class Button {
	private _state: BtnState;
	private lastTimeStamp: number;
	get elapsedSinceUpdate() {
		return getTodayTimeStamp() - this.lastTimeStamp;
	}
	get state() {
		if (this.elapsedSinceUpdate >= MS_DELAY_BTN[BtnState.Down] && (this._state == BtnState.Down || this._state == BtnState.Dbl))
			this._state = BtnState.Hold;

		if (this.elapsedSinceUpdate >= MS_DELAY_BTN[BtnState.Up] && this._state == BtnState.Released)
			this._state = BtnState.Up;

		return this._state;
	}
	private set state(state: BtnState) {
		this.lastTimeStamp = getTodayTimeStamp();
		this._state = state;
	}
	constructor() {
		this.state = BtnState.Up;
	}
	toggle(newState: BtnState.Up | BtnState.Down) {
		const currentState = this.state; //? MUST PICK the getter
		if (EVENT_BTNSTATE[newState].indexOf(currentState) != -1) { //? If the new State is similar to the current state (like released and up)
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

	private _mouse: { pos: Coord, wheel: {x: WheelAxis, y: WheelAxis}, btn: Record<number, Button>, isInside: boolean }
	private _keys: Record<string, Button>;

	notPreventedCodes: string[];

	constructor() {
		super();
		this._mouse = {pos: new Coord(0,0), wheel: {x: new WheelAxis, y: new WheelAxis}, btn: {}, isInside: null};
		this._keys = {};
		this.notPreventedCodes = ['F5', 'F12'];

		//#region Add events
		MainCanvas.get.cnv.addEventListener('contextmenu', e => e.preventDefault()); //? prevent right click menu

		/* MainCanvas.get.cnv.addEventListener('wheel', e => {
			e.preventDefault(); //TODO figure out how to reset the wheel object
			Input.get._mouse.wheel.x = clamp(e.deltaX, -1, 1) +1 -1;
			Input.get._mouse.wheel.y = clamp(e.deltaY, -1, 1) +1 -1;
		}, {passive: false}); //? passive -> https://chromestatus.com/feature/6662647093133312 */

		MainCanvas.get.cnv.addEventListener('mousemove', e => {
			Input.get._mouse.pos.x = e.clientX;
			Input.get._mouse.pos.y = e.clientY;
		});
		
		MainCanvas.get.cnv.addEventListener('mousedown', e => {
			e.preventDefault();
			this.toggleMouseBtn(e.button, BtnState.Down);
		})
		MainCanvas.get.cnv.addEventListener('mouseup', e => {
			this.toggleMouseBtn(e.button, BtnState.Up);
		})
		MainCanvas.get.cnv.addEventListener('mouseenter', e => {
			Input.get._mouse.isInside = true;
		})
		MainCanvas.get.cnv.addEventListener('mouseleave', e => {
			Input.get._mouse.isInside = false;
		})
		MainCanvas.get.cnv.addEventListener('keydown', e => {
			const code = replaceKeyCode(e.code);

			if (this.notPreventedCodes.indexOf(code) == -1)
				e.preventDefault()

			this.toggleKeybtn(code, BtnState.Down);
		});
		MainCanvas.get.cnv.addEventListener('keyup', e => {
			const code = replaceKeyCode(e.code);
			this.toggleKeybtn(code, BtnState.Up);
		});
		//#endregion
	}
	private toggleMouseBtn(btnIndex: number, newState: BtnState.Up | BtnState.Down) {
		if (Input.get._mouse.btn[btnIndex] === undefined)
			Input.get._mouse.btn[btnIndex] = new Button();
		Input.get._mouse.btn[btnIndex].toggle(newState);
	}
	private toggleKeybtn(code: KeyCode, newState: BtnState.Up | BtnState.Down) {
		if (Input.get._keys[code] === undefined)
			Input.get._keys[code] = new Button();

		Input.get._keys[code].toggle(newState);
	}

	//#region Static getters and methods
	static get mousePos() {
		return Input.get._mouse.pos;
	}
	static get mouseIn() {
		return Input.get._mouse.isInside;
	}
	static get mouseWheel() {
		return Input.get._mouse.wheel;
	}
	static get mouseBtn() {
		return Input.get._mouse.btn;
	}
	static get keys() {
		return Input.get._keys;
	}
	static keyState(keyCode: string) {
		if (Input.get._keys[keyCode] === undefined)
			Input.get._keys[keyCode] = new Button();

		return Input.get._keys[keyCode].state;
	}
	//#endregion
}
//#endregion

//#region Functions
export function replaceKeyCode(code: string) {
	return code.replace('Key', 'K').replace('Digit', 'D').replace('Numpad', 'P').replace('Arrow', '') as KeyCode;
}
export function getTodayTimeStamp() {
	const date = new Date();
	return ((date.getHours() * 60 + date.getMinutes())*60 + date.getSeconds()) * 1000 + date.getMilliseconds();
}
//#endregion