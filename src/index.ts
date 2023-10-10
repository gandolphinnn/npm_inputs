export enum DrawAction {
	Stroke,
	Fill,
	Both
}
export class Graphics {
	//#region Definition
	public body : HTMLBodyElement;
	public canvas : HTMLCanvasElement;
	public ctx : CanvasRenderingContext2D;
	public center : Coord;

	constructor() {
		if (document.querySelector("body") == null) {
			throw new Error('Body element not found');
		}
		this.body = document.querySelector("body")!;

		if (document.querySelector("canvas") == null) {
			throw new Error('Canvas element not found');
		}
		this.canvas = document.querySelector("canvas")!;

		if (this.canvas.getContext("2d") == null) {
			throw new Error('2D Context not found');
		}
		this.ctx = this.canvas.getContext("2d")!;

		//* fullscreen mode
		if (typeof this.canvas.width === 'undefined' || typeof this.canvas.height === 'undefined') {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.body.style.overflow = 'hidden';
			this.body.style.margin = '0px';
		}
		this.center = new Coord(this.canvas.width/2, this.canvas.height/2)
	}
	//#endregion

	//#region Screen
	public Clean() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	public Action(drawAction : DrawAction | null) {
		if (drawAction == DrawAction.Both || drawAction == DrawAction.Fill) {
			this.ctx.fill();
		}
		if (drawAction == DrawAction.Both || drawAction == DrawAction.Stroke) {
			this.ctx.stroke();
		}
	}
	public WriteText(text : string, coord: Coord) {
		this.ctx.fillText(text, coord.x - 30, coord.y+3)
	}
	//#endregion

	//#region Coord
	public SumCoords (coord1 : Coord, coord2 : Coord) : Coord {
		return new Coord(coord1.x + coord2.x, coord1.y + coord2.y);
	}
	public SumCoordValues (coord1 : Coord, x : number, y : number) : Coord {
		return new Coord(coord1.x + x, coord1.y + y);
	}
	public CoordDistance (coord1 : Coord, coord2 : Coord) {
		return Math.sqrt(((coord1.x - coord2.x) ** 2) + ((coord1.y - coord2.y) ** 2));
	}
	//#endregion

	//#region Draw
	public DrawCircle (coord : Coord, radius : number, drawAction : DrawAction | null) {
		this.ctx.beginPath();
		this.ctx.arc(coord.x, coord.y, radius, 0, Math.PI * 2);
		this.Action(drawAction)
	}
	public DrawRectByVal (coord : Coord, width : number, length : number, drawAction : DrawAction | null) {
		this.ctx.beginPath();
		this.ctx.rect(coord.x, coord.y, width, length);
		this.Action(drawAction)
	}
	public DrawRectByCoords (coord1 : Coord, coord2 : Coord, drawAction : DrawAction | null) {
		let x = (coord2.x < coord1.x)? coord2.x : coord1.x;
		let y = (coord2.y < coord1.y)? coord2.y : coord1.y;
		let width = Math.abs(coord1.x-coord2.x);
		let height = Math.abs(coord1.y-coord2.y);	
		this.DrawRectByVal(new Coord(x, y), width, height, drawAction);
	}
	public DrawLine (coord1: Coord, coord2: Coord, drawAction : DrawAction | null) {
		this.ctx.beginPath();
		this.ctx.moveTo(coord1.x, coord1.y);
		this.ctx.lineTo(coord2.x, coord2.y);
		this.Action(drawAction)
	}
	public DrawSample (testunit : number = 0) {
		this.Clean();
		let sampleUnits = [1, 5, 10, 50, 100, 250, 500, 1000];
		if (testunit > 0 && testunit < this.canvas.width && sampleUnits.indexOf(testunit) == -1) {
			sampleUnits.push(testunit);
			sampleUnits.sort(function(a, b) {
				return a - b;
			});
		}
		let coord = new Coord(this.center.x - 500, this.center.y-(20*sampleUnits.length/2));
		this.ctx.lineWidth = 4;
		sampleUnits.forEach(unit => {
			this.ctx.strokeStyle = unit == testunit ? 'red' : 'black';
			this.WriteText(unit.toString(), this.SumCoordValues(coord, -30, +3))
			this.DrawLine(coord, this.SumCoordValues(coord, unit, 0), DrawAction.Stroke);
			coord.Add(0, 20);
		});
	}
	//#endregion
}
export class Coord {
	public x : number;
	public y : number;

	constructor(x : number, y : number) {
		this.x = x;
		this.y = y;
	}
	Set(newX : number, newY : number) {
		this.x = newX;
		this.y = newY;
	}
	Add(addX : number, addY : number) {
		this.x += addX;
		this.y += addY;
	}
};

export class Line {
	public coord1 : Coord;
	public coord2 : Coord;

	constructor(coord1 : Coord, coord2 : Coord) {
		this.coord1 = coord1;
		this.coord2 = coord2;
	}

	public get length() {
		return Math.sqrt(((this.coord1.x - this.coord2.x) ** 2) + ((this.coord1.y - this.coord2.y) ** 2))
	}
};