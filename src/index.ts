import { Singleton, clamp, coalesce } from '@gandolphinnn/utils';
import { Coord, MainCanvas } from '@gandolphinnn/graphics2';
import { BtnState, Button, WheelAxis } from './button.js';
export * from './button.js';
//#region Enum, Constants

export type KeyCode = 'Backspace' | 'Tab' | 'Enter' | 'ShiftLeft' | 'ShiftRight' | 'ControlLeft' | 'ControlRight' | 'AltLeft' | 'AltRight' | 'Pause' | 'CapsLock' | 'Escape' | 'Space' | 'PageUp' | 'PageDown' | 'End' | 'Home' | 'Left' | 'Up' | 'Right' | 'Down' | 'PrintScreen' | 'Insert' | 'Delete' | 'D0' | 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8' | 'D9' | 'Quote' | 'KA' | 'KB' | 'KC' | 'KD' | 'KE' | 'KF' | 'KG' | 'KH' | 'KI' | 'KJ' | 'KK' | 'KL' | 'KM' | 'KN' | 'KO' | 'KP' | 'KQ' | 'KR' | 'KS' | 'KT' | 'KU' | 'KV' | 'KW' | 'KX' | 'KY' | 'KZ' | 'MetaLeft' | 'MetaRight' | 'ContextMenu' | 'P0' | 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7' | 'P8' | 'P9' | 'PMultiply' | 'PAdd' | 'PSubtract' | 'PDecimal' | 'PDivide' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'F10' | 'F11' | 'F12' | 'NumLock' | 'ScrollLock' | 'Semicolon' | 'Equal' | 'Comma' | 'Minus' | 'Period' | 'Slash' | 'Backquote' | 'BracketLeft' | 'Backslash' | 'BracketRight'
//#endregion

//#region Classes

export class Input extends Singleton {
	private static get get() { return this.singletonInstance as Input }

	private _mouse: { pos: Coord, wheel: {x: WheelAxis, y: WheelAxis}, btn: Record<number, Button>, isInside: boolean }
	private _keys: Record<string, Button>;

	notPreventedCodes: KeyCode[];

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
//#endregion