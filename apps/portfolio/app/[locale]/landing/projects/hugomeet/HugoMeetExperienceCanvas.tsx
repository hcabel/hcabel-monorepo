"use client";

import * as THREE from "three";

import ExperienceCanvas from "../(shared)/ExperienceCanvas";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import CustomScrollTriggers from "../../(elements)/CustomScrollTriggers";

export default function HugoMeetExperienceCanvas()
{
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
					const scene = (experience.Resources?.at(1)?.Value as GLTF)?.scene;
					if (scene) {
						scene.rotation.y = progress * endRotation + startRotation;
					}
					else {
						console.log("scene is null");
					}
				}
				// Update 3d scene when scrolling
				scrollTrigger.onScroll = update;
				// First update to set state before scroll
				update(window.location.hash === "#top" ? 1 : 0);
			}}
		/>
	);
}