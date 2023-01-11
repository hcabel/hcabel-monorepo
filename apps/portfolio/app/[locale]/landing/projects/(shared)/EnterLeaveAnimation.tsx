"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface IEnterLeaveAnimationProps {
	children: React.ReactNode;
}

export default function EnterLeaveAnimation(props: IEnterLeaveAnimationProps)
{
	const pathname = usePathname();

	useEffect(() => {
		// I usually do not rely on setTimeout, but in this case it is the only way to make it work.
		// The reason is that window.location.hash is not updated yet when this useEffect is called.
		// The value is always the previous one.
		setTimeout(() => {
			const hash = window.location.hash;
			const element = document.getElementById("EnterLeaveAnimation_Div");
			// Set in the top of the screen (instantly) then animate to the bottom
			console.log(1, pathname, hash);
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
		}, 50);
	}, [pathname]);

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