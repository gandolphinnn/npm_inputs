import { MainCanvas, getSubStyleValue } from '@gandolphinnn/graphics2';
import { Input, BtnState } from './index.js';

function animate(timestamp: number) {
	//ctx.clearRect(0,0, innerWidth, innerHeight);
	requestAnimationFrame(animate);
	//console.log(BtnState[Input.keyState('KW')]);
	//console.log(Input.mouseWheel());
}
window.requestAnimationFrame(animate);
/**/