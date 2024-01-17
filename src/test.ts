import { MainCanvas } from '@gandolphinnn/graphics2';
import { Input, getTimeStamp } from './index.js';

console.log(Input.mousePos());

function animate() {
	requestAnimationFrame(animate);
	//ctx.clearRect(0,0, innerWidth, innerHeight);
	//console.log(Input.mousePos(), Input.mouseBtnState(0));

}
animate();
/**/