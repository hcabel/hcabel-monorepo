"use client";

// Libs
import { useEffect } from 'react';

// Design
import Style from './ExperienceCanvas.module.scss';

import Experience from '3D/Experience';

interface IExperienceCanvasProps {
	id: string;
}

export default function ExperienceCanvas(props: IExperienceCanvasProps)
{

	useEffect(() => {
		const element = document.getElementById(props.id) as HTMLCanvasElement;
		// Init the 3D experience for the first time
		// NOTE: I Call 'new Experience()' in other places to get the reference to the experience
		//     but even if those line are triggered before this one, the canvas is not initialized
		//     the only way init the experience is by calling the constructor with an element or calling the init method
		new Experience(element);
	}, [props.id]);

	return (
		<canvas {...props} className={Style.ThreeJsCanvas3D} />
	);
}