"use client";

import * as THREE from "three";

import ExperienceCanvas from "../projects/(shared)/ExperienceCanvas";
import { useRef } from "react";
import CustomScrollTriggers from "./CustomScrollTriggers";

export default function IntroExperienceCanvas()
{
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

				// Update scene position depending on scroll progress
				function update(progress: number) {
				}
				// Update 3d scene when scrolling
				scrollTrigger.onScroll = update;
				// First update to set state before scroll
				update(window.location.hash === "#top" ? 1 : 0);
			}}
		/>
	);
}