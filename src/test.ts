import { Circle, MainCanvas, Text, getSubStyleValue } from '@gandolphinnn/graphics2';
import { Input, BtnState } from './index.js';

function animate(timestamp: number) {
	MainCanvas.get.ctx.clearRect(0,0, innerWidth, innerHeight);
	requestAnimationFrame(animate);
	new Circle(Input.mousePos(), 5).render();
}
window.requestAnimationFrame(animate);
/**/