"use client";

import * as THREE from "three";

import ExperienceCanvas from "../../(elements)/ExperienceCanvas";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import CustomScrollTriggers from "../../(utils)/CustomScrollTriggers";
import { GetCameraPositionToFocusBox } from "../../(utils)/3dSceneInteraction";

export default function UvchExperienceCanvas()
{
	return (
		<ExperienceCanvas
			texture="/3dScenes/T_Uvch.webp"
			scenePath="/3dScenes/uvch_scene.glb"
			style={{
				position: "absolute",
				top: 0,
				left: "25%",
				width: "100vw",
				height: "100vh",
			}}
			onResize={(experience) => {
				const boundingBox = new THREE.Box3();
				boundingBox.setFromCenterAndSize(
					// Scene position
					new THREE.Vector3(0, 0, 0),
					// Size of the box
					new THREE.Vector3(10, (window.innerWidth <= 920 ? 15 : 20), 10)
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
				const startRotation = Math.PI / 180 * 70;
				const endRotation = Math.PI / 180 * -70;

				const scrollTrigger = CustomScrollTriggers.getTriggerbyId("uvch_scroll_trigger");
				if (!scrollTrigger) {
					throw new Error("uvch_scroll_trigger is null");
				}

				experience.World.Camera.Focus(new THREE.Vector3(0, 0, 0), true);

				// Update scene position depending on scroll progress
				function update(progress: number) {
					const scene = (experience.Resources?.at(1)?.Value as GLTF)?.scene;
					if (scene) {
						scene.rotation.y = progress * endRotation + startRotation;
					}
				}
				// Update 3d scene when scrolling
				scrollTrigger.onScroll = update;
				// First update to set state before scroll
				update(scrollTrigger.Progress);
			}}
			onDispose={() => {
				// clean the scroll trigger scroll event otherwise it will be called before the onReady when going back to the page
				const scrollTrigger = CustomScrollTriggers.getTriggerbyId("uvch_scroll_trigger");
				scrollTrigger.onScroll = () => {};
			}}
		/>
	);
}