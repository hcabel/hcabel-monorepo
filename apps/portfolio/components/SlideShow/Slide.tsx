import * as React from 'react';
import gsap from 'gsap/dist/gsap';

export interface ISlideProps {
	children?: React.ReactNode;
	onConstruct?: (self: any) => void;
	onUpdate?: (self: any, progress: number) => void;
	onEnter?: (self: any, direction: number) => void;
	onLeave?: (self: any, direction: number) => void;
	onScroll?: (self: any, progress: number) => void;
	onResize?: (self: any, ) => void;
	LeaveTransition?: gsap.TweenVars;
}

export default function Slide(props: ISlideProps): JSX.Element
{
	return (
		<div className="slide">
			{props.children}
		</div>
	);
}