"use client";

import * as THREE from "three";

import ExperienceCanvas from "../projects/(shared)/ExperienceCanvas";
import CustomScrollTriggers from "./CustomScrollTriggers";
import { GetCameraPositionToFocusBox } from "../(utils)/3dSceneInteraction";

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
			onResize={(experience) => {
				const boundingBox = new THREE.Box3();
				boundingBox.setFromCenterAndSize(
					// Scene position
					new THREE.Vector3(0, 0, 0),
					// Size of the box
					new THREE.Vector3(5, 5, 20)
				);

				// Move camera to make sure the box is always fully visible
				experience.World.Camera.MoveToVector3(
					GetCameraPositionToFocusBox(
						boundingBox,
						new THREE.Vector3(-1, 0, 0),
						experience.World.Camera.PerspectiveCamera
					),
					true
				);
			}}
			onReady={(experience) => {
				const scrollTrigger = CustomScrollTriggers.getTriggerbyId("intro_scroll_trigger");
				if (!scrollTrigger) {
					throw new Error("intro_scroll_trigger is null");
				}

				experience.World.Camera.Focus(new THREE.Vector3(0, 0, 0), true);

				// Update scene position depending on scroll progress
				function update(progress: number) {
				}
				// Update 3d scene when scrolling
				scrollTrigger.onScroll = update;
				// First update to set state before scroll
				update(scrollTrigger.Progress);
			}}
		/>
	);
}