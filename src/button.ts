export enum BtnState {
	Up, Down, Released, Hold, Dbl
}

export type WheelState = 0 | 1 | -1;
const MS_DELAY_BTN = {
	[BtnState.Up]: 300, //? Delay from Button.Released to Button.Up
	[BtnState.Down]: 400 //? Delay from Button.Down or Button.Dbl to Button.Hold
}
const MS_DELAY_WHEEL_RESET: number = 300; //? Delay from Wheel.x or Wheel.y == -1 or 1 to == 0

const EVENT_BTNSTATE = {
	[BtnState.Up]: [BtnState.Up, BtnState.Released],
	[BtnState.Down]: [BtnState.Down, BtnState.Hold, BtnState.Dbl]
}


export function getTodayTimeStamp() {
	const date = new Date();
	return ((date.getHours() * 60 + date.getMinutes())*60 + date.getSeconds()) * 1000 + date.getMilliseconds();
}
class Timer {
	protected _timeStamp: number;
	protected get elapsed() {
		return getTodayTimeStamp() - this._timeStamp;
	}
	constructor() {
		this._timeStamp = getTodayTimeStamp();
	}
}
export class WheelAxis extends Timer {
	private _state: WheelState;
	get state() {
		if (this.state !== 0 && this.elapsed >= MS_DELAY_WHEEL_RESET) {
			this.state = 0;
		}
		return this._state;
	}
	private set state(state: WheelState) {
		if (this.state === state) {
			return;
		}
		this._timeStamp = getTodayTimeStamp();
		this._state = state;
	}
	constructor() {
		super();
		this._state = 0;
	}
}
//todo extends Timer
export class Button {
	private _state: BtnState;
	private lastTimeStamp: number;
	get elapsedSinceUpdate() {
		return getTodayTimeStamp() - this.lastTimeStamp;
	}
	get state() {
		if (this.elapsedSinceUpdate >= MS_DELAY_BTN[BtnState.Down] && (this._state == BtnState.Down || this._state == BtnState.Dbl))
			this._state = BtnState.Hold;

		if (this.elapsedSinceUpdate >= MS_DELAY_BTN[BtnState.Up] && this._state == BtnState.Released)
			this._state = BtnState.Up;

		return this._state;
	}
	private set state(state: BtnState) {
		this.lastTimeStamp = getTodayTimeStamp();
		this._state = state;
	}
	constructor() {
		this.state = BtnState.Up;
	}
	toggle(newState: BtnState.Up | BtnState.Down) {
		const currentState = this.state; //? MUST PICK the getter
		if (EVENT_BTNSTATE[newState].indexOf(currentState) != -1) { //? If the new State is similar to the current state (like released and up)
			return;
		}
		switch (currentState) {
			case BtnState.Up:		this.state = BtnState.Down;		break;
			case BtnState.Down:		this.state = BtnState.Released;	break;
			case BtnState.Released:	this.state = BtnState.Dbl;		break;
			case BtnState.Hold:		this.state = BtnState.Up;		break;
			case BtnState.Dbl:		this.state = BtnState.Released;	break;
		}
	}
}