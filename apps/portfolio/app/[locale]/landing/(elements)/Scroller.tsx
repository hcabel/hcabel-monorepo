"use client";

import { useEffect } from 'react';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import GSAP from 'gsap';
import { usePathname, useRouter } from 'next/navigation';
import { Locales } from 'App/[locale]/layout';

import Style from '../page.module.scss';

interface IScrollerProps {
	children: React.ReactNode;
	projectInfo: any[];
	locale: Locales;
}

export default function Scroller(props: IScrollerProps)
{
	const router = useRouter();
	const pathname = usePathname();

	// Scroll at the slide position in the scrollbar
	function ScrollToPosition(): Promise<void>
	{
		// Get index of the current project
		const i = props.projectInfo.findIndex((project) => (pathname === `/${props.locale}${project.url}`));
		if (i === -1) {
			throw new Error('Slide does not exist');
		}
		// Get all the divs before the current one
		const previousDivs = document.querySelectorAll(`#InvisibleDivs > div:nth-child(-n+${i})`);
		// Sum the there heights, +10 to make sure that the scroll is not too close to the previous div
		let targetPosition = 10;
		previousDivs.forEach((div) => {
			targetPosition += div.clientHeight;
		});
		// Scroll to the right position
		window.scrollTo({
			top: targetPosition,
			behavior: 'auto'
		});

		return (new Promise((resolve, reject) => {
			// Timeout in case of error
			const timeout = setTimeout(() => {
			  reject();
			}, 2000);

			function scrollHandler()
			{
				if (self.pageYOffset === targetPosition) {
					window.removeEventListener("scroll", scrollHandler);
					clearTimeout(timeout);
					resolve();
				}
			};
			if (self.pageYOffset === targetPosition) {
				clearTimeout(timeout);
				setTimeout(() => {
					resolve();
				}, 100)
			}
			else {
				window.addEventListener("scroll", scrollHandler);
			}
		}));
	}

	useEffect(() => {
		ScrollToPosition()
			.then(() => {
				// Register ScrollTrigger plugin
				GSAP.registerPlugin(ScrollTrigger);

				// Create ScrollTrigger for each project except the first one
				props.projectInfo.forEach((project, i) => {
					// Controll scroll using ScrollTrigger
					if (i === 0) {
						// No used of registering ScrollTrigger for the first project
						// because mvoving to the 2st slide will be triggered by the onEnter of the 2nd slide
						// and onLeaveBack is useless since there is no previous slide
						return;
					}
					ScrollTrigger.create({
						trigger: document.getElementById(`InvisibleDiv_${i}`),
						start: "top top",
						end: "bottom top",
						// Trigger when enter from the top
						onEnter: () => {
							router.push(`/${props.locale}${project.url}`);
						},
						// Trigger when leaving from the top
						onLeaveBack: () => {
							const previousProject = props.projectInfo[i - 1];
							router.push(`/${props.locale}${previousProject.url}`);
						},
					});
				});
			})
	}, []);


	// Prefetch All the slide so that the transition is near instant, and the user doesn't feel the switch of page when scrolling
	useEffect(() => {
		props.projectInfo.forEach((project, i) => {
			router.prefetch(`${props.locale}${project.url}`);
		});
	}, [])

	return (
		<div id="Scroller" style={{ scrollBehavior: 'auto' }}>
			<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
				{props.children}
			</div>
			<div id="InvisibleDivs">
				{
					props.projectInfo.map((project, i) =>
					<div id={`InvisibleDiv_${i}`} className={`${Style.Background} ${project.background}`} key={i} style={{ height: `calc(100vh + ${project.height})` }} />
					)
				}
			</div>
		</div>
	);
}