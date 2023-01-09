"use client";

import * as THREE from "three";

import ExperienceCanvas from "../(shared)/ExperienceCanvas";
import { useEffect, useRef } from "react";
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export default function ProceduralTerrainExperienceCanvas()
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
				let proceduralTerrainScrollTrigger = ScrollTrigger.getById("procedural_terrain_scroll_trigger");
				const startRotation = Math.PI / 4 /* 45deg */;
				const endRotation = -Math.PI * 2 /* 360deg */;

				experience.World.Camera.MoveToVector3(new THREE.Vector3(-1, 1, 0).multiplyScalar(25), true);
				experience.World.Camera.Focus(new THREE.Vector3(0, 0, 0), true);
				(experience.Resources[1].Value as GLTF).scene.rotation.y = startRotation;

				experience.on('update', () => {
					if (isScrolling.current) {
						if (!proceduralTerrainScrollTrigger) {
							proceduralTerrainScrollTrigger = ScrollTrigger.getById("procedural_terrain_scroll_trigger");
							console.warn("procedural_terrain_scroll_trigger is null");
							return;
						}
						const progress = proceduralTerrainScrollTrigger.progress;
						(experience.Resources[1].Value as GLTF).scene.rotation.y = progress * endRotation + startRotation;
					}
				});
			}}
		/>
	);
}