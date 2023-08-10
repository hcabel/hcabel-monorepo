"use client";

// Libs
import { useEffect } from "react";

// Design
import Style from "./ProjectScroll.module.scss";

// Hooks
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "App/[locale]/LocaleContext";
import ProjectsInfos from "../(utils)/getProjectsInfos";
import CustomScrollTriggers from "../(utils)/CustomScrollTriggers";

interface IProjectScrollBarProps {
	children: React.ReactNode;
}

export default function ProjectScrollBar(props: IProjectScrollBarProps) {
	const { locale } = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	// This is the duration of a single animation, we need two of them to make the full transition
	const TransitionDuration = 250; // ms

	function MoveScrollContent(start: number, end: number) {
		const scrollContent = document.getElementById("ScrollContent");
		// Move to start pos with no transition
		scrollContent.style.transition = "none";
		scrollContent.style.top = `${start}vh`;

		// Return if the element is already at the right position
		if (start === end) {
			return;
		}

		// We delay the transition to make sure that the element is moved to the start position before the transition is applied
		setTimeout(() => {
			// Move to start pos with transition
			scrollContent.style.transition = `top ${
				TransitionDuration / 1000
			}s ease-in-out`;
			scrollContent.style.top = `${end}vh`;
		}, 50);
	}

	function changePage(projectIndex: number, direction: 1 | -1) {
		const newProjectIndex = projectIndex + (direction === 1 ? 0 : -1);
		// Animate the content to the opposite direction
		MoveScrollContent(0, direction * -100);

		const backgroundDivs = document.querySelectorAll<HTMLDivElement>(
			"#BackgroundDivs > div"
		);
		backgroundDivs.forEach((div) => {
			div.style.opacity =
				div.id === `BackgroundDiv_${newProjectIndex}`
					? "1"
					: "0";
		});

		// lock scroll to current position to avoid scrolling while the animation is running
		const scrollPosition = window.pageYOffset + direction * 100; // + offset to make sure that the scroll is not too close to the previous div

		const LockScroll = () => {
			console.log(scrollPosition);
			window.scrollTo({
				top: scrollPosition,
				behavior: "auto"
			});
		}
		window.addEventListener("scroll", LockScroll);

		// once the animation is done, change the page
		setTimeout(() => {
			const previousProject = ProjectsInfos[newProjectIndex];
			router.push(
				`/${locale}${previousProject.url}${
					direction === 1 ? "#bottom" : "#top"
				}`
			);

		}, TransitionDuration);

		// Unlock scroll after the transition is done
		setTimeout(() => {
			window.removeEventListener("scroll", LockScroll);
		}, TransitionDuration * 2);
	}

	// Scroll to a specific position using a promise that is resolve once the scroll animation is done
	function ScrollToFirstPosition(): Promise<void> {
		// Find the current project index
		const projectIndex = ProjectsInfos.findIndex(
			(project) => pathname === `/${locale}${project.url}`
		);
		if (projectIndex === -1) {
			throw new Error("Project not found");
		}

		// Get all the divs before the current one
		const previousDivs = document.querySelectorAll(
			`#InvisibleDivs > div:nth-child(-n+${projectIndex})`
		);
		let targetPosition = 0;
		previousDivs.forEach((div) => {
			targetPosition += div.clientHeight;
		});
		// Sum the there heights, +10 to make sure that the scroll is not too close to the previous div
		targetPosition += targetPosition === 0 ? 0 : 10;
		// Scroll to the right position
		window.scrollTo({
			top: targetPosition,
			behavior: "auto",
		});

		// Check if the scroll is done
		// if it takes too long, reject the promise,
		// otherwise resolve it when the scroll reach the right position
		return new Promise((resolve, reject) => {
			// Timeout in case of error
			const timeout = setTimeout(() => {
				if (self.pageYOffset - targetPosition > 100)
					reject(`Timeout ${self.pageYOffset} !== ${targetPosition}`);
				else
					resolve();
			}, 2000);

			function scrollHandler() {
				if (Math.round(self.pageYOffset) === targetPosition) {
					window.removeEventListener("scroll", scrollHandler);
					clearTimeout(timeout);
					resolve();
				}
			}
			if (Math.round(self.pageYOffset) === targetPosition) {
				clearTimeout(timeout);
				resolve();
			} else {
				window.addEventListener("scroll", scrollHandler);
			}
		});
	}

	// This constructor will create all the scroll triggers and set the position of the scroll for the first time
	useEffect(() => {
		// Disable scroll restoration
		window.history.scrollRestoration = "manual";

		// just in case I clear all the scroll triggers
		CustomScrollTriggers.killAll();
		// Create all the scroll triggers (disabled by default to avoid trigger while scrolling to first position)
		ProjectsInfos.forEach((project, i) => {
			CustomScrollTriggers.create({
				id: project.scrollTriggerId,
				trigger: document.getElementById(`InvisibleDiv_${i}`),
				start: "top top",
				end: "top bottom",
				enable: false,
				onEnter: () => {
					changePage(i, 1);
				},
				onLeave:
					i === 0 ? undefined : () => {
							changePage(i, -1);
						},
			});
		});

		const currentprojectIndex = ProjectsInfos.findIndex(
			(project) => pathname === `/${locale}${project.url}`
		);
		const currentBackgroundDiv = document.getElementById(
			`BackgroundDiv_${currentprojectIndex}`
		);
		currentBackgroundDiv.style.opacity = "1";

		// Scroll to the first position then enable all the triggers
		ScrollToFirstPosition()
			.then(() => {
				CustomScrollTriggers.Triggers.forEach((trigger) => {
					trigger.enable();
				});
			})
			.catch((e) => {
				console.error("Error while scrolling to the right position:", e);
			});
	}, []);

	// This useEffect will trigger the enter animation when the user change page
	useEffect(() => {
		setTimeout(() => {
			const hash = window.location.hash;
			// Animate content depending on the hash
			if (hash === "#top") {
				MoveScrollContent(-100, 0);
			} else if (hash === "#bottom") {
				MoveScrollContent(100, 0);
			} else {
				// Move from 0 to 0 to get an instant transition
				MoveScrollContent(0, 0);
			}
		}, 100);
	}, [pathname]);

	// Prefetch All the slide so that the transition is near instant, and the user doesn't feel the switch of page when scrolling
	useEffect(() => {
		ProjectsInfos.forEach((project) => {
			router.prefetch(`${locale}${project.url}`);
		});
	}, [locale]);

	return (
		<div style={{ scrollBehavior: "auto" }}>
			{/* All the invitible divs that allow the scroll bar to show */}
			<div id="InvisibleDivs">
				{ProjectsInfos.map((project, i) => (
					<div
						id={`InvisibleDiv_${i}`}
						key={i}
						style={{ height: `calc(100vh + ${project.height})` }}
					/>
				))}
			</div>
			{/* I show the background here for smooth transition between prokect pages */}
			<div id="BackgroundDivs">
				{ProjectsInfos.map((project, i) => (
					<div
						key={i}
						id={`BackgroundDiv_${i}`}
						className={`${Style.Background} ${project.background}`}
					/>
				))}
			</div>
			{/* Real content on top of all the rest (has to be the last) */}
			<div
				id="ScrollContent"
				className={Style.ScrollContent}
				style={{ top: "100vh" }}
			>
				{props.children}
			</div>
		</div>
	);
}
