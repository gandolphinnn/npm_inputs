import { Singleton } from '@gandolphinnn/utils';
import { Coord } from '@gandolphinnn/graphics2';

export class Input extends Singleton {
	private static get get() { return this.singletonInstance as Input }

	private _mouse: {
		pos: Coord,
		btn: {
			l: boolean,
			m: boolean,
			r: boolean
		}
	}
	private _key: Record<string, boolean>;

	static get mouse() { return Input.get._mouse }
	static get key() { return Input.get._key }
	constructor() {
		super();
		this._mouse = {pos: new Coord(0,0), btn: {l: false, m: false, r: false}};
		this._key = {};
	}
	static init() {
		this.singletonInstance as Input
		document.addEventListener('contextmenu', e => e.preventDefault()); //? prevent right click menu
		document.addEventListener('mousedown', e => {
			switch (e.button) {
				case 0: Input.mouse.btn.l = true; break;
				case 1: Input.mouse.btn.m = true; e.preventDefault(); break; //? prevent middle click scroller
				case 2: Input.mouse.btn.r = true; break;
				default: break;
			}
		})
		document.addEventListener('mouseup', e => {
			switch (e.button) {
				case 0: Input.mouse.btn.l = false; break;
				case 1: Input.mouse.btn.m = false; break;
				case 2: Input.mouse.btn.r = false; break;
				default: break;
			}
		})
		document.addEventListener('mousemove', e => {
			Input.mouse.pos.y = e.clientY;
			Input.mouse.pos.x = e.clientX;
		});
		document.addEventListener('keydown', e => {
			//if (e.code != 'F5' && e.code != 'F12') e.preventDefault() //? allow to refresh and to open the page inspect
			let code = e.code.replace('Key', 'K').replace('Digit', 'D').replace('Numpad', 'P').replace('Arrow', '');
			Input.key[code] = true;
		});
		document.addEventListener('keyup', e => {
			let code = e.code.replace('Key', 'K').replace('Digit', 'D').replace('Numpad', 'P').replace('Arrow', '');
			delete Input.key[code];
		});
	};
}