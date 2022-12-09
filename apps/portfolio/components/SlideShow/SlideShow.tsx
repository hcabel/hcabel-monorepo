
import { useEffect, useState } from 'react';
import { ISlideProps } from './Slide';

import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import GSAP from 'gsap';
import EventEmitter from 'events';

export interface ISlideShowProps {
	children: React.ReactElement<ISlideProps>[];
	actions?: EventEmitter;
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

	index: number;
	active: boolean;
	progess: number;
}

export default function SlideShow({ children, actions }: ISlideShowProps)
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
				index: i,
				active: false,
				progess: 0
			};
			return slide;
		})
	);

	useEffect(() => {
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
					slideBefore.progress = 1;
					slideBefore.active = false;
					slide.onEnter?.(slide, 1);
					slide.progress = 0;
					slide.active = true;

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
					slide.progress = 0;
					slide.active = false;
					const slideBefore = _Slides[i - 1];
					slideBefore?.onEnter?.(slideBefore, -1);
					slideBefore.progress = 1;
					slideBefore.active = true;

					// Move UI
					GSAP.to(".slide", {
						y: `${-100 * (i - 1) }vh`,
						ease: "expo",
						overwrite: true,
						...(_Slides[i - 1].LeaveTransition || {})
					});
				}),
				onUpdate: ({ progress }) => {
					slide.progress = progress;
					// Call slide events if onEnter has been triggered before
					if (slide.active) {
						slide.onScroll?.(slide, progress);
					}
				}
			});
		});
		_Slides[0].onEnter(_Slides[0], 1);
		_Slides[0].progress = 0;
		_Slides[0].active = true;

		// Move to another slide
		actions.on('move', (direction: number) => {
			if (!direction && direction !== 0) {
				return;
			}

			// get active slide
			const activeSlide = _Slides.find(slide => slide.active);
			if (activeSlide) {
				// get next slide
				const nextSlide = _Slides[activeSlide.index + direction];
				if (nextSlide) {
					// scroll to the next slide
					document.getElementById(`InvisibleDiv_${nextSlide.index}`).scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					});
				}
			}
		});

		// Refresh the current slide
		actions?.on('refresh', () => {
			_Slides.forEach(slide => {
				if (slide.active) {
					// Call all the life cycle events
					slide.onConstruct(slide);
					slide.onEnter(slide, 1);
					slide.onUpdate?.(slide, slide.progess);
				}
			});
		});

		// Go to a specific slide
		actions?.on('goto', (index: number) => {
			if (!index && index !== 0) {
				return;
			}

			// get active slide
			const activeSlide = _Slides.find(slide => slide.active);
			if (activeSlide) {
				// get goto slide
				const gotoSlide = _Slides[index];
				if (gotoSlide) {
					// Find direction to the goto slide
					const direction = gotoSlide.index - activeSlide.index;
					actions.emit('move', direction);
					console.log(direction);
				}
			}
		});
	}, [_Slides, actions]);

	return (
		<>
			<div style={{ position: 'fixed', width: '100%', height: '100%' }}>
				{children}
			</div>
			{/* Generate X invisible div for scrolling */}
			{children.map((child, index) =>
				<div key={index} id={`InvisibleDiv_${index}`} style={{ width: "100vw", height: `${child.props.Length || 100}vh` }} />
			)}
			{/* We add one more to allow the last one to have a scroll animation */}
			<div key={children.length} id={`InvisibleDiv_${children.length}`} style={{ width: "100vw", height: "100vh" }} />
		</>
	);
}