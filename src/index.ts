export type ind = string
let mouse = {
	pos: new Coord(),
	btn: {
		l: false,
		m: false,
		r: false
	}
};
let key = {};
document.addEventListener('contextmenu', e => e.preventDefault()); //? prevent right click menu
document.addEventListener('mousedown', e => {
	switch (e.button) {
		case 0: mouse.btn.l = true; break;
		case 1: mouse.btn.m = true; e.preventDefault(); break; //? prevent middle click scroller
		case 2: mouse.btn.r = true; break;
		default: break;
	}
	if (inspectVar != undefined) {
		console.log(inspectVar);
	}
})
document.addEventListener('mouseup', e => {
	switch (e.button) {
		case 0: mouse.btn.l = false; break;
		case 1: mouse.btn.m = false; break;
		case 2: mouse.btn.r = false; break;
		default: break;
	}
})
document.addEventListener('mousemove', e => {
	mouse.pos.y = e.clientY;
	mouse.pos.x = e.clientX;
});
document.addEventListener('keydown', e => {
	if (e.code != 'F5' && e.code != 'F12')
		e.preventDefault() //? allow to refresh and to open the page inspect
	let code = e.code.replace('Key', 'K').replace('Digit', 'D').replace('Numpad', 'P').replace('Arrow', '');
	key[code] = true;
});
document.addEventListener('keyup', e => {
	let code = e.code.replace('Key', 'K').replace('Digit', 'D').replace('Numpad', 'P').replace('Arrow', '');
	key[code] = false;
});