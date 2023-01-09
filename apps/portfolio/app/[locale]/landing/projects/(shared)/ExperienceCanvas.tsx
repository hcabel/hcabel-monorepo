"use client";

import { useEffect, useState } from "react";

import Experience from "3D/Experience";
import Resource from "3D/utils/Resource";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

interface IExperienceCanvasProps {
	texture: string;
	scenePath: string;
	style?: React.CSSProperties;
	id?: string;
	className?: string;
	onReady? (experience: Experience): void;
}

export default function ExperienceCanvas(props: IExperienceCanvasProps)
{
	const [_Experience, set_Experience] = useState<Experience | null>(null);
	useEffect(() => {
		const canvas = document.getElementById(props.id || "ExperienceCanvas") as HTMLCanvasElement;
		const experience = new Experience(canvas,
			new Resource<THREE.Texture, string>(props.texture, "texture"),
			new Resource<GLTF, string>(props.scenePath, "gltf")
		);
		set_Experience(experience);

		experience.once('ready', () => {
			props.onReady(experience);
		})

		return () => {
			experience.Dispose();
		};
	}, []);


	return (
		<div className={props.className || ''} style={props.style || {}}>
			<canvas style={{ width: "100%", height: "100%" }} id={props.id || "ExperienceCanvas"} />
		</div>
	);
}