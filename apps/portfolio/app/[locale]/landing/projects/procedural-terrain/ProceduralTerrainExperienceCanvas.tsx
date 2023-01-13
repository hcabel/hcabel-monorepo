"use client";

import * as THREE from "three";

import ExperienceCanvas from "../(shared)/ExperienceCanvas";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import CustomScrollTriggers from "../../(elements)/CustomScrollTriggers";

export default function ProceduralTerrainExperienceCanvas()
{
	return (
		<ExperienceCanvas
			texture="/3dscenes/T_ProceduralTerrain.webp"
			scenePath="/3dscenes/procedural_terrain_scene.glb"
			style={{
				position: "absolute",
				top: 0,
				left: "25%",
				width: "100vw",
				height: "100vh",
			}}
			onReady={(experience) => {
				const startRotation = Math.PI / 4 /* 45deg */;
				const endRotation = -Math.PI * 2 /* 360deg */;

				const scrollTrigger = CustomScrollTriggers.getTriggerbyId("procedural_terrain_scroll_trigger");
				if (!scrollTrigger) {
					throw new Error("procedural_terrain_scroll_trigger is null");
				}

				experience.World.Camera.MoveToVector3(new THREE.Vector3(-1, 1, 0).multiplyScalar(25), true);
				experience.World.Camera.Focus(new THREE.Vector3(0, 0, 0), true);
				(experience.Resources[1].Value as GLTF).scene.rotation.y = startRotation;

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
				update(window.location.hash === "#top" ? 1 : 0);
			}}
		/>
	);
}