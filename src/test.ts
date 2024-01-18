import { MainCanvas } from '@gandolphinnn/graphics2';
import { Input, BtnState } from './index.js';

console.log(-0 +1 -1);
function animate(timestamp: number) {
	//ctx.clearRect(0,0, innerWidth, innerHeight);
	requestAnimationFrame(animate);
	//console.log(BtnState[Input.keyState('KW')]);
	console.log(Input.mouseWheel());
}
window.requestAnimationFrame(animate);
/**/