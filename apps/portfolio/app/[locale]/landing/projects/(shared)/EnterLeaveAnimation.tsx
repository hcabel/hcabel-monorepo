"use client";

import { useEffect } from "react";

interface IEnterLeaveAnimationProps {
	children: React.ReactNode;
}

export default function EnterLeaveAnimation(props: IEnterLeaveAnimationProps)
{
	useEffect(() => {
		const hash = window.location.hash;
		const element = document.getElementById("EnterLeaveAnimation_Div");
		// Set in the top of the screen (instantly) then animate to the bottom
		if (hash === "#top") {
			element.style.top = '-100vh';
			element.style.transform = 'translateY(100vh)';
		}
		// Set in the bottom of the screen (instantly) then animate to the top
		else if (hash === "#bottom") {
			element.style.top = '100vh';
			element.style.transform = 'translateY(-100vh)';
		}
		// Set in the middle of the screen (instantly)
		else {
			element.style.top = '0vh';
		}

	}, []);

	return (
		<section
			id="EnterLeaveAnimation_Div"
			style={{
				position: "relative",
				width: "100%",
				height: "100%",
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