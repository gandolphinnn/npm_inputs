import { Circle, Color, Coord, MainCanvas, Mesh, Text, getSubStyleValue } from '@gandolphinnn/graphics2';
import { arrPivot, objPivot } from '@gandolphinnn/utils'
import Enumerable from 'linq/linq.js'
import { Input, BtnState } from './index.js';

const c = MainCanvas.get;
c.writeStyle.mergeFont('50px Arial')

const animate: FrameRequestCallback = (timestamp: number) => {
	MainCanvas.get.ctx.clearRect(0,0, innerWidth, innerHeight);
	requestAnimationFrame(animate);
	circ.style.mergeFillStyle(Color.byName(Input.mouseIn? 'Black' : 'Red'));
	
	mesh.center = Input.mousePos;
	btnText.content = logBtns();
	keyText.content = logKeys();
	console.log(Input.keys); //! keys dont work!!!!
	
	mesh.render();
}
const circ = new Circle(new Coord(0,0), 5);
const btnText = new Text(new Coord(0,-90), '');
const keyText = new Text(new Coord(0,-30), '');
const mesh = new Mesh(new Coord(0,0), circ, keyText, btnText)
window.requestAnimationFrame(animate);
function logBtns() {
	return JSON.stringify(Enumerable.from(Input.mouseBtn).toArray().map((btn) => {
		return `${btn.key}, ${BtnState[btn.value.state]}`
	}));
}
function logKeys() {
	return JSON.stringify(Enumerable.from(Input.keys).toArray().map((btn) => {
		return `${btn.key}, ${BtnState[btn.value.state]}`
	}));
}
/**/