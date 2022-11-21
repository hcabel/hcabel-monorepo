
import { useEffect, useState } from 'react';
import { ISlideProps } from './Slide';

import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import GSAP from 'gsap';
import Experience from '3D/Experience';

export interface ISlideShowProps {
	children: React.ReactElement<ISlideProps>[];
}

export interface ISlideClass {
	jsx: React.ReactElement<ISlideProps>;
	onConstruct: (self: any) => void;
	onUpdate: (self: any, progress: number) => void;
	onEnter: (self: any, direction: number) => void;
	onLeave: (self: any, direction: number) => void;
	onScroll: (self: any, progress: number) => void;
	onResize: (self: any) => void;
	[key: string]: any;
}

export default function SlideShow({ children }: ISlideShowProps)
{
	const [_Slides] = useState<ISlideClass[]>(
		children.map((jsx, i) => {
			const slide: ISlideClass = {
				jsx: jsx,
				...jsx.props,
				onConstruct: jsx.props.onConstruct || (() => {}),
				onUpdate: jsx.props.onUpdate || (() => {}),
				onEnter: jsx.props.onEnter || (() => {}),
				onLeave: jsx.props.onLeave || (() => {}),
				onScroll: jsx.props.onScroll || (() => {}),
				onResize: jsx.props.onResize || (() => {}),
				index: i
			};
			return slide;
		})
	);

	useEffect(() => {
		new Experience().on('initialized', () => {
			GSAP.registerPlugin(ScrollTrigger);

			_Slides.forEach((slide, i) => {
				slide.onConstruct(slide);

				// The first element dont need onEnter/OnLeaveBack, but still need to track the process
				// note: onEnter and onLeaveBack are not setted in the first slide because it will never be triggered.
				ScrollTrigger.create({
					trigger: document.getElementById(`InvisibleDiv_${i}`),
					start: "top top",
					end: "bottom top",
					// Trigger when you come from the top
					onEnter: (i === 0 ? undefined : () => {
						// Call slide events
						const slideBefore = _Slides[i - 1];
						slideBefore?.onLeave?.(slideBefore, 1);
						slide.onEnter?.(slide, 1);

						// Move UI
						GSAP.to(".slide", {
							y: `${-100 * i}vh`,
							ease: "expo",
							overwrite: true,
							...slideBefore.LeaveTransition
						});
					}),
					// Trigger when you leave from the top
					onLeaveBack: (i === 0 ? undefined : () => {
						// Call slide events
						slide.onLeave?.(slide, -1);
						const slideBefore = _Slides[i - 1];
						slideBefore?.onEnter?.(slideBefore, -1);

						// Move UI
						GSAP.to(".slide", {
							y: `${-100 * (i - 1) }vh`,
							ease: "expo",
							overwrite: true,
							...(_Slides[i - 1].LeaveTransition || {})
						});
					}),
					onUpdate: ({ progress }) => {
						// Call slide events
						slide.onScroll?.(slide, progress);
					}
				});
			});
			_Slides[0].onEnter(_Slides[0], 1);
		});
	}, [_Slides]);

	return (
		<>
			<div style={{ position: 'fixed', width: '100%', height: '100%' }}>
				{children}
			</div>
			{/* Generate X invisible div for scrolling */}
			{children.map((_child, index) =>
				<div key={index} id={`InvisibleDiv_${index}`} style={{ width: "100vw", height: "100vh" }} />
			)}
			{/* We add one more to allow the last one to have a scroll animation */}
			<div key={children.length} id={`InvisibleDiv_${children.length}`} style={{ width: "100vw", height: "100vh" }} />
		</>
	);
}