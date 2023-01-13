"use client";

import * as THREE from "three";

import ExperienceCanvas from "../(shared)/ExperienceCanvas";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import CustomScrollTriggers from "../../(elements)/CustomScrollTriggers";
import { GetCameraPositionToFocusBox } from "../../(utils)/3dSceneInteraction";

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
				transition: "left 0.5s",
				width: "100vw",
				height: "100vh",
			}}
			onResize={(experience) => {
				const boundingBox = new THREE.Box3();
				boundingBox.setFromCenterAndSize(
					// Scene position
					new THREE.Vector3(0, 0, 0),
					// Size of the box
					new THREE.Vector3(10, 15, (window.innerWidth <= 920 ? 20 : 22.5))
				);

				// Move camera to make sure the box is always fully visible
				experience.World.Camera.MoveToVector3(
					GetCameraPositionToFocusBox(
						boundingBox,
						new THREE.Vector3(-1, 0.25, 0),
						experience.World.Camera.PerspectiveCamera
					),
					true
				);
			}}
			onReady={(experience) => {
				const startRotation = Math.PI / 180 * 60;
				const endRotation = Math.PI / 180 * -120;

				const scrollTrigger = CustomScrollTriggers.getTriggerbyId("hugomeet_scroll_trigger");
				if (!scrollTrigger) {
					throw new Error("hugomeet_scroll_trigger is null");
				}

				// Keep looking at the middle of the scene
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