export interface TriggerArgs {
	id?: string;
	trigger: HTMLElement;
	// Describes a place on the startTrigger, the first describe the hit point, the second describe the trigger point to hit by the first
	start?: `${"top" | "bottom"} ${"top" | "bottom"}`;
	// Describes a place on the endTrigger, the first describe the hit point, the second describe the trigger point to hit by the first
	end?: `${"top" | "bottom"} ${"top" | "bottom"}`;
	markers?: boolean;
	onScroll?: (progress: number) => void;
	onLeave?: () => void;
	onEnter?: () => void;
	onLeaveBack?: () => void;
	onEnterBack?: () => void;
	enable?: boolean;
}

function createMarkers(
	type: string,
	id: string,
	matchWidthEl: HTMLElement,
	pos: number,
	isFlip: boolean = false
) {
	const markersDefault = {
		startColor: "green",
		endColor: "red",
		indent: 0,
		fontSize: "16px",
		fontWeight: "normal",
	};

	const div = document.createElement("div");
	const isScroller = type.indexOf("scroller") !== -1;
	const parent = document.body;
	const isStart = type.indexOf("start") !== -1;
	const color = isStart ? markersDefault.startColor : markersDefault.endColor;
	let css =
		"border-color:" +
		color +
		";font-size:" +
		markersDefault.fontSize +
		";color:" +
		color +
		";font-weight:" +
		markersDefault.fontWeight +
		";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";

	css += "position:" + (isScroller ? "fixed;" : "absolute;");
	if (!isScroller) {
		css += `bottom: ${markersDefault.indent}px;`;
	}
	if (matchWidthEl) {
		css +=
			"box-sizing:border-box;text-align:left;width:" +
			matchWidthEl.offsetWidth +
			"px;";
	}
	(div as any)._isStart = isStart;
	div.setAttribute(
		"class",
		"gsap-marker-" + type + (id ? " marker-" + id : "")
	);
	div.style.cssText = css;
	div.innerText = id ? type + "-" + id : type;
	if (parent.children[0]) {
		parent.insertBefore(div, parent.children[0]);
	} else {
		parent.appendChild(div);
	}

	div.style.height = "10%";

	// div.style[`border${isFlip ? "Bottom" : "Top"}Width`] = "1px";
	// div.style[`border${isFlip ? "Top" : "Bottom"}Width`] = "0px";
	div.style.borderTopWidth = "1px";

	div.style.top = `${pos}px`;

	return div;
}

class Triggers {
	public _Enable: boolean;
	public readonly id: string;
	// start position of the trigger in pixels from the top of the page
	public readonly start: number;
	// position of the start trigger in pixels from the top of the viewport
	public readonly startTrigger: number;
	// end position of the trigger in pixels from the top of the page
	public readonly end: number;
	// position of the end trigger in pixels from the top of the viewport
	public readonly endTrigger: number;
	// Show debug markers
	public readonly markers: boolean;

	private _Markers: HTMLDivElement[];

	public onScroll = (progress: number) => {};
	public onLeave = () => {};
	public onEnter = () => {};
	public onLeaveBack = () => {};
	public onEnterBack = () => {};

	private _Element: HTMLElement;
	private _ElementObserver: IntersectionObserver;

	// Real progress mean that this value can be negative or greater than 1
	private _RealProgress: number = 0;
	get Progress(): number {
		return Math.max(0, Math.min(1, this._RealProgress));
	}

	private CalculateCurrentProgress() {
		const scroll = window.scrollY;
		const positionOfTheEndTrigger = scroll + this.endTrigger;
		return (positionOfTheEndTrigger - this.start) / (this.end - this.start);
	}

	constructor(args: TriggerArgs) {
		// setup event
		if (args.onScroll) this.onScroll = args.onScroll;
		if (args.onLeave) this.onLeave = args.onLeave;
		if (args.onEnter) this.onEnter = args.onEnter;
		if (args.onLeaveBack) this.onLeaveBack = args.onLeaveBack;
		if (args.onEnterBack) this.onEnterBack = args.onEnterBack;

		this._Enable = args.enable;

		const start = args.start.split(" ");
		const end = args.end.split(" ");

		this.id = args.id || Math.random().toString(36).substring(7);
		this.start =
			args.trigger.offsetTop +
			(start[1] === "top" ? 0 : args.trigger.offsetHeight);
		this.startTrigger = 0 + (start[0] === "top" ? 0 : window.innerHeight);
		this.end =
			args.trigger.offsetTop +
			(end[1] === "top" ? 0 : args.trigger.offsetHeight);
		this.endTrigger = 0 + (end[0] === "top" ? 0 : window.innerHeight);

		this.markers = args.markers || false;
		if (this.markers) {
			// Add debug markers
			this._Markers = [
				createMarkers("start", this.id, args.trigger, this.start),
				createMarkers(
					"scroller-start",
					this.id,
					args.trigger,
					this.startTrigger
				),
				createMarkers("end", this.id, args.trigger, this.end, true),
				createMarkers(
					"scroller-end",
					this.id,
					args.trigger,
					this.endTrigger
				),
			];
		}

		this._Element = args.trigger;

		// Observe the trigger
		this._ElementObserver = new IntersectionObserver(
			(entries) => {
				if (this._Enable) {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							// Reset the progress before doing anything (otherwise it may trigger events when it shouldn't)
							this._RealProgress =
								this.CalculateCurrentProgress();
							document.addEventListener("scroll", () =>
								this.documentScroll()
							);
						} else {
							document.removeEventListener("scroll", () =>
								this.documentScroll()
							);
						}
					});
				}
			},
			{ threshold: 0 }
		);

		this._Enable ? this.enable() : this.disable();
	}

	public enable() {
		this._Enable = true;

		this._ElementObserver.observe(this._Element);
	}

	public disable() {
		this._Enable = false;

		this._ElementObserver.disconnect();
		document.removeEventListener("scroll", () => this.documentScroll());
	}

	private documentScroll() {
		const progress = this.CalculateCurrentProgress();

		if (this._RealProgress < 0 && progress >= 0) {
			this.onEnter();
		} else if (this._RealProgress > 1 && progress <= 1) {
			this.onEnterBack();
		} else if (
			this._RealProgress >= 0 &&
			this._RealProgress <= 1 &&
			progress < 0
		) {
			this.onLeave();
		} else if (
			this._RealProgress >= 0 &&
			this._RealProgress <= 1 &&
			progress > 1
		) {
			this.onLeaveBack();
		}

		if (progress >= 0 && progress <= 1) {
			this.onScroll(Math.min(Math.max(progress, 0), 1));
		}

		this._RealProgress = progress;
	}

	public cleanUp() {
		this.disable();
		if (this.markers) {
			this._Markers.forEach((marker) => {
				marker.remove();
			});
		}
	}
}

export class CustomScrollTriggers {
	private static _Instance: CustomScrollTriggers;

	private _Triggers: Triggers[] = [];

	get Triggers(): Triggers[] {
		return this._Triggers;
	}

	constructor() {
		if (CustomScrollTriggers._Instance) {
			return CustomScrollTriggers._Instance;
		}
		CustomScrollTriggers._Instance = this;
	}

	public create(args: TriggerArgs) {
		if (args.id) {
			const trigger = this.getTriggerbyId(args.id);
			if (trigger) {
				throw new Error(`Trigger with id "${args.id}" already exist`);
			}
		}
		const trigger = new Triggers(args);
		this._Triggers.push(trigger);
		return trigger;
	}

	public getTriggerbyId(id: string): Triggers | undefined {
		return this._Triggers.find((trigger) => trigger.id === id);
	}

	public kill(id: string) {
		const trigger = this.getTriggerbyId(id);
		if (trigger) {
			trigger.cleanUp();
			this._Triggers = this._Triggers.filter(
				(trigger) => trigger.id !== id
			);
		}
	}

	public killAll() {
		this._Triggers.forEach((trigger) => {
			trigger.cleanUp();
		});
		this._Triggers = [];
	}
}

export default new CustomScrollTriggers();
