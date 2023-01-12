"use client";

import * as THREE from "three";

import ExperienceCanvas from "../(shared)/ExperienceCanvas";
import { useEffect, useRef } from "react";
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export default function UvchExperienceCanvas()
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
			texture="/3dscenes/T_Uvch.webp"
			scenePath="/3dscenes/uvch_scene.glb"
			style={{
				position: "absolute",
				top: 0,
				left: "25%",
				width: "100vw",
				height: "100vh",
			}}
			onReady={(experience) => {
				let uvchScrollTrigger = ScrollTrigger.getById("uvch_scroll_trigger");
				const startRotation = Math.PI / 180 * 70;
				const endRotation = Math.PI / 180 * -70;

				experience.World.Camera.MoveToVector3(new THREE.Vector3(-1, 0.25, 0).multiplyScalar(25), true);
				experience.World.Camera.Focus(new THREE.Vector3(0, 0, 0), true);
				(experience.Resources[1].Value as GLTF).scene.rotation.y = startRotation;

				// Update animation related to scroll
				function update()
				{
					if (!uvchScrollTrigger) {
						uvchScrollTrigger = ScrollTrigger.getById("uvch_scroll_trigger");
						console.warn("uvch_scroll_trigger is null");
						return;
					}
					const progress = uvchScrollTrigger.progress;
					(experience.Resources[1].Value as GLTF).scene.rotation.y = progress * endRotation + startRotation;
				}
				// Update at every frame if scrolling (for performance saving purpose)
				experience.on('update', () => {
					if (isScrolling.current) {
						update();
					}
				});
				// First update to set state before scroll
				update();
			}}
		/>
	);
}