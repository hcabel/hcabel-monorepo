"use client";

import * as THREE from "three";

import ExperienceCanvas from "../projects/(shared)/ExperienceCanvas";
import { useEffect, useRef } from "react";
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export default function IntroExperienceCanvas()
{
	// True because if we enter the page while scrolling, the scrollEnd event will not be triggered
	// and this var is here mainly to prevent for performance saving purpose
	const isScrolling = useRef(true);

	useEffect(() => {
		ScrollTrigger.addEventListener("scrollStart", () => {
			isScrolling.current = true;
		});
		ScrollTrigger.addEventListener("scrollEnd", () => {
			isScrolling.current = false;
		});
	}, []);

	return (
		<ExperienceCanvas
			texture="/3dscenes/T_Intro.webp"
			scenePath="/3dscenes/intro_scene.glb"
			style={{
				position: "absolute",
				top: 0,
				width: "100vw",
				height: "100vh",
			}}
			onReady={(experience) => {
				let introScrollTrigger = ScrollTrigger.getById("intro_scroll_trigger");

				experience.World.Camera.MoveToVector3(new THREE.Vector3(-1, 0, 0).multiplyScalar(25), true);
				experience.World.Camera.Focus(new THREE.Vector3(0, 0, 0), true);
				(experience.Resources[1].Value as GLTF).scene.rotation.y = 0;

				experience.on('update', () => {
					if (isScrolling.current) {
						if (!introScrollTrigger) {
							introScrollTrigger = ScrollTrigger.getById("intro_scroll_trigger");
							console.warn("intro_scroll_trigger is null");
							return;
						}
						const progress = introScrollTrigger.progress;
					}
				});
			}}
		/>
	);
}