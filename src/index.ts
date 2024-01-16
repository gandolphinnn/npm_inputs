import { overflow, clamp, Singleton, arrPivot } from '@gandolphinnn/utils';
import { Coord } from '@gandolphinnn/graphics2';

export class Input extends Singleton {
	static get get() { return this.singletonInstance as Input }

	mouse: {
		pos: Coord,
		btn: {
			l: boolean,
			m: boolean,
			r: boolean
		}
	}
	key: Record<string, boolean>;
}
document.addEventListener('contextmenu', e => e.preventDefault()); //? prevent right click menu
document.addEventListener('mousedown', e => {
	switch (e.button) {
		case 0: Input.get.mouse.btn.l = true; break;
		case 1: Input.get.mouse.btn.m = true; e.preventDefault(); break; //? prevent middle click scroller
		case 2: Input.get.mouse.btn.r = true; break;
		default: break;
	}
})
document.addEventListener('mouseup', e => {
	switch (e.button) {
		case 0: Input.get.mouse.btn.l = false; break;
		case 1: Input.get.mouse.btn.m = false; break;
		case 2: Input.get.mouse.btn.r = false; break;
		default: break;
	}
})
document.addEventListener('mousemove', e => {
	Input.get.mouse.pos.y = e.clientY;
	Input.get.mouse.pos.x = e.clientX;
});
document.addEventListener('keydown', e => {
	//if (e.code != 'F5' && e.code != 'F12') e.preventDefault() //? allow to refresh and to open the page inspect
	let code = e.code.replace('Key', 'K').replace('Digit', 'D').replace('Numpad', 'P').replace('Arrow', '');
	Input.get.key[code] = true;
});
document.addEventListener('keyup', e => {
	let code = e.code.replace('Key', 'K').replace('Digit', 'D').replace('Numpad', 'P').replace('Arrow', '');
	Input.get.key[code] = false;
});