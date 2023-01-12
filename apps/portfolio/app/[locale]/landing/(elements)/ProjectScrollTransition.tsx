"use client";

import GSAP from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

import { useLocale } from "App/[locale]/LocaleContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import ProjectsInfos from "../getProjectsInfos";

interface IProjectScrollTransitionProps {
	children: React.ReactNode;
	name: string;
}

export default function ProjectScrollTransition(props: IProjectScrollTransitionProps)
{
	const { locale } = useLocale();
	const pathname = usePathname();
	const router = useRouter();

	// This is the duration of a single animation, we need two of them to make the full transition
	const TransitionDuration = 250; // ms

	function MoveScrollContent(element: HTMLElement, start: number, end: number)
	{
		// Move to start pos with no transition
		element.style.transition = 'none';
		element.style.top = `${start}vh`;

		// Return if the element is already at the right position
		if (start === end) {
			return;
		}

		// We delay the transition to make sure that the element is moved to the start position before the transition is applied
		setTimeout(() => {
			// Move to start pos with transition
			element.style.transition = `top ${TransitionDuration / 1000}s ease-in-out`;
			element.style.top = `${end}vh`;
			console.log(3, 'MoveScrollContent', element.style.top);
		}, 50)
	}

	function changePage(projectIndex: number, direction: 1 | -1)
	{
		// Disable scroll, (+ an offet to make sure that the scroll is not too close to the previous div)
		const scrollTop = window.scrollY + direction * 10;
		window.onscroll = function() {
			window.scrollTo(0, scrollTop);
		};

		// Animate the content to the opposite direction
		const scrollContent = document.getElementById('ProjectScrollTransitionDiv');
		MoveScrollContent(scrollContent, 0, direction * -100);
		// once the animation is done, change the page
		setTimeout(() => {
			const previousProject = ProjectsInfos[projectIndex + direction];
			router.push(`/${locale}${previousProject.url}${direction === 1 ? '#bottom' : '#top'}`);
		}, TransitionDuration);
	}

	// Scroll to a specific position using a promise that is resolve once the scroll animation is done
	function ScrollToProjectPosition(projectIndex: number): Promise<void>
	{
		// Get all the divs before the current one
		const previousDivs = document.querySelectorAll(`#InvisibleDivs > div:nth-child(-n+${projectIndex})`);
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

		// Check if the scroll is done
		// if it takes too long, reject the promise,
		// otherwise resolve it when the scroll reach the right position
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
				resolve();
			}
			else {
				window.addEventListener("scroll", scrollHandler);
			}
		}));
	}

	function createScrollTrigger(projectIndex: number)
	{

		// Scroll to the right position
		GSAP.registerPlugin(ScrollTrigger);

		// kill all scroll triggers
		ScrollTrigger.getAll().forEach((st) => st.kill());
		// create current scroll trigger
		ScrollTrigger.create({
			id: props.name,
			trigger: document.getElementById(`InvisibleDiv_${projectIndex}`),
			start: "top top",
			end: "bottom top",
			// Trigger when leaving from the bottom
			onLeave: (projectIndex === ProjectsInfos.length - 1 ? undefined : () => {
				// Go to the next project
				changePage(projectIndex, +1);
			}),
			// Trigger when leaving from the top
			onLeaveBack: (projectIndex === 0 ? undefined : () => {
				// Go to the previous project
				changePage(projectIndex, -1);
			}),
		});
	}

	useEffect(() => {
		// I usually do not rely on setTimeout, but in this case it is the only way to make it work.
		// The reason is that window.location.hash is not updated yet when this useEffect is called.
		// The value is always the previous one.
		setTimeout(() => {


			// Get index of the current project
			const projectIndex = ProjectsInfos.findIndex((project) => (pathname === `/${locale}${project.url}`));
			if (projectIndex === -1) {
				throw new Error('Slide does not exist');
			}

			// Get direction where you come from (depending on the hash)
			const element = document.getElementById("ProjectScrollTransitionDiv");
			const hash = window.location.hash;

			// Animate content depending on the hash
			if (hash === "#top") {
				MoveScrollContent(element, -100, 0);
			}
			if (hash === "#bottom") {
				MoveScrollContent(element, 100, 0);
			}
			else {
				// Move from 0 to 0 to get an instant transition
				MoveScrollContent(element, 0, 0);
			}

			// check if scroll position is in the range of the current project
			const scrollPosition = window.scrollY;
			// start by calculating the height of all the previous divs
			const previousDivs = document.querySelectorAll(`#InvisibleDivs > div:nth-child(-n+${projectIndex})`);
			let previousDivsHeight = 0;
			previousDivs.forEach((div) => {
				previousDivsHeight += div.clientHeight;
			});
			const currentDiv = document.getElementById(`InvisibleDiv_${projectIndex}`);
			const currentDivHeight = currentDiv.clientHeight;
			// If not, scroll to the right position then create the scroll trigger
			if (scrollPosition < previousDivsHeight || scrollPosition > previousDivsHeight + currentDivHeight) {
				ScrollToProjectPosition(projectIndex).then(() => {
					createScrollTrigger(projectIndex);
				});
			}
			else {
				createScrollTrigger(projectIndex);
			}

			// Enable scroll
			window.onscroll = function() {};

		}, 100);
	}, []);

	return (
		<section
			id="ProjectScrollTransitionDiv"
			style={{
				position: "relative",
				width: "100vw",
				height: "100vh",
				// Hide by default to avoid flickering
				top: '100vh',
				// transistion only on transform
				transition: "transform 0.5s ease-in-out"
			}}
		>
			{props.children}
		</section>
	);
}