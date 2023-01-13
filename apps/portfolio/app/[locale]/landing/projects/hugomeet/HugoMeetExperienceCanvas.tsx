"use client";

import * as THREE from "three";

import ExperienceCanvas from "../(shared)/ExperienceCanvas";
import { useEffect, useRef } from "react";
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import CustomScrollTriggers from "../../(elements)/CustomScrollTriggers";

export default function HugoMeetExperienceCanvas()
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
			texture="/3dscenes/T_HugoMeet.webp"
			scenePath="/3dscenes/hugomeet_scene.glb"
			style={{
				position: "absolute",
				top: 0,
				left: "25%",
				width: "100vw",
				height: "100vh",
			}}
			onReady={(experience) => {
				const startRotation = Math.PI / 180 * 60;
				const endRotation = Math.PI / 180 * -120;

				const scrollTrigger = CustomScrollTriggers.getTriggerbyId("hugomeet_scroll_trigger");
				if (!scrollTrigger) {
					throw new Error("hugomeet_scroll_trigger is null");
				}

				experience.World.Camera.MoveToVector3(new THREE.Vector3(-1, 0.25, 0).multiplyScalar(25), true);
				experience.World.Camera.Focus(new THREE.Vector3(0, 0, 0), true);

				// Update scene position depending on scroll progress
				function update(progress: number) {
					(experience.Resources[1].Value as GLTF).scene.rotation.y = progress * endRotation + startRotation;
				}
				// Update at every frame if scrolling (for performance saving purpose)
				experience.on('update', () => {
					if (isScrolling.current) {
						const progress = scrollTrigger.Progress;
						update(progress);
					}
				});
				update(window.location.hash === "#top" ? 1 : 0);
			}}
		/>
	);
}