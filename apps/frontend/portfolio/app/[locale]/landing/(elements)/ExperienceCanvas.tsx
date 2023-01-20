"use client";

import { useEffect, useState } from "react";

import Experience from "3D/Experience";
import Resource from "3D/utils/Resource";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

import Style from "./ExperienceCanvas.module.scss";

interface IExperienceCanvasProps {
	texture: string;
	scenePath: string;
	style?: React.CSSProperties;
	id?: string;
	className?: string;
	onReady?(experience: Experience): void;
	onResize?(experience: Experience): void;
	onDispose?(experience: Experience): void;
}

export default function ExperienceCanvas(props: IExperienceCanvasProps) {
	const [_Experience, set_Experience] = useState<Experience | null>(null);
	useEffect(() => {
		const canvas = document.getElementById(
			props.id || "ExperienceCanvas"
		) as HTMLCanvasElement;
		const experience = new Experience(
			canvas,
			new Resource<THREE.Texture, string>(props.texture, "texture"),
			new Resource<GLTF, string>(props.scenePath, "gltf")
		);
		set_Experience(experience);

		const wrapper = document.getElementById("ExperienceWrapper");
		experience.on("resize", () => {
			wrapper.style.left =
				window.innerWidth <= 920 ? "0px" : `${props.style.left}`;
			props.onResize?.(experience);
		});

		experience.once("ready", () => {
			props.onReady?.(experience);
		});

		return () => {
			props.onDispose?.(experience);
			experience?.Dispose();
		};
	}, []);

	return (
		<div
			id="ExperienceWrapper"
			className={props.className || ""}
			style={{ background: "transparent", ...props.style }}
		>
			<canvas
				className={Style.Canvas}
				id={props.id || "ExperienceCanvas"}
			/>
		</div>
	);
}
