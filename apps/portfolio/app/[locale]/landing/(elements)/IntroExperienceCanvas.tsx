"use client";

import * as THREE from "three";

import ExperienceCanvas from "../projects/(shared)/ExperienceCanvas";
import { useEffect, useRef } from "react";
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import CustomScrollTriggers from "./CustomScrollTriggers";

export default function IntroExperienceCanvas()
{
	// True because if we enter the page while scrolling, the scrollEnd event will not be triggered
	// and this var is here mainly to prevent for performance saving purpose
	const isScrolling = useRef(true);

	useEffect(() => {
		ScrollTrigger.addEventListener("scrollStart", () => {
			isScrolling.current = true;
			console.log("scrollStart")
		});
		ScrollTrigger.addEventListener("scrollEnd", () => {
			isScrolling.current = false;
			console.log("scrollEnd")
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
				const scrollTrigger = CustomScrollTriggers.getTriggerbyId("intro_scroll_trigger");
				if (!scrollTrigger) {
					throw new Error("intro_scroll_trigger is null");
				}

				experience.World.Camera.MoveToVector3(new THREE.Vector3(-1, 0, 0).multiplyScalar(25), true);
				experience.World.Camera.Focus(new THREE.Vector3(0, 0, 0), true);

				// Update animation related to scroll
				function update(progress: number)
				{

				}
				// Update at every frame
				experience.on('update', () => {
					update(scrollTrigger.Progress);
				});
				// First update to set state before scroll
				update(window.location.hash === "#top" ? 1 : 0);
			}}
		/>
	);
}