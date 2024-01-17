import { Singleton, clamp, coalesce } from '@gandolphinnn/utils';
import { Coord } from '@gandolphinnn/graphics2';

enum BtnState {
	Up, Down, Hold, Released, Dbl
}
class Button {
	private _state: BtnState;
	get state() { //TODO this getter update the state based on the last update
		return this._state
	}
	lastUpdate: Date;
	setState(state: BtnState.Up | BtnState.Down ) {
		const currentVal = this.state; //MUST PICK the getter
		switch (state) {
			case BtnState.:
				
				break;
		
			default:
				break;
		}

		const BTN_STATE_FLOW = {
			[BtnState.Up]: {
				[BtnState.Up]: BtnState.Up,
				[BtnState.Down]: BtnState.Down,
			},
			[BtnState.Down]: {
				[BtnState.Up]: BtnState.Released,
				[BtnState.Down]: BtnState.Hold,
			},
			[BtnState.Hold]: {
				[BtnState.Up]: BtnState.Released,
				[BtnState.Down]: BtnState.Hold,
			},
			[BtnState.Released]: {
				[BtnState.Up]: BtnState.Up,
				[BtnState.Down]: BtnState.Dbl,
			},
			[BtnState.Dbl]: {
				[BtnState.Up]: BtnState.Released,
				[BtnState.Down]: BtnState.Hold,
			},
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
		Input.get._key[code] = BTN_STATE_FLOW[currentVal][isDown] as BtnState
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