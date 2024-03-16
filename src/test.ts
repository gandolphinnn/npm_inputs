import { Color, MainCanvas } from '@gandolphinnn/graphics2';
import { Input } from './index.js';

const c = MainCanvas.get;
c.writeStyle.mergeFont('15px Arial');
c.bgColor = Color.byName('Grey');

Input.test()
/**/