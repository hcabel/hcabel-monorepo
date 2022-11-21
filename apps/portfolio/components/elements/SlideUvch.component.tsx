import { useEffect, useState } from 'react';
import * as THREE from 'three';

import Style from 'Styles/pages/index.module.scss';

import Experience from '3D/Experience';
import Slide, { ISlideProps } from 'Components/SlideShow/Slide';
import ProjectFirstImpression from 'Components/ProjectFirstImpression';

interface ISlideUvchProps extends ISlideProps {
	staticProps: any;
}

export default function SlideUvch(props: ISlideUvchProps)
{
	const [_ShowDetails, set_ShowDetails] = useState(false);

	return (
		<Slide
			onConstruct={(self: any) => {
				self._Camera = new Experience().World.Camera;
				self._CamPath = new THREE.CatmullRomCurve3([
					new THREE.Vector3(-7, 15, -25).normalize(),
					new THREE.Vector3(-15, 5, -15).normalize(),
					new THREE.Vector3(-25, 15, 2).normalize(),
				]);
			}}
			onEnter={(self: any, direction: number) => {
				console.log("onEnter", self.index);
				const camPosition = self._CamPath.getPointAt(direction === -1 ? 1 : 0).multiply(new THREE.Vector3(25, 25, 25));
				self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z);
				self._Camera.LookAt(new THREE.Vector3(0, 0, 0));
			}}
			onScroll={(self: any, progress: number) => {
				console.log("onScroll", self.index, progress);

				// follow path
				const camPosition = self._CamPath.getPointAt(progress).multiply(new THREE.Vector3(25, 25, 25));
				self._Camera.MoveTo(camPosition.x, camPosition.y, camPosition.z, true);
				self._Camera.LookAt(new THREE.Vector3(0, 0, 0), true);

				if (progress > 0.5 && !_ShowDetails) {
					set_ShowDetails(true);
				}
				else if (progress < 0.5 && _ShowDetails) {
					set_ShowDetails(false);
				}
			}}
		>
			<div className={Style.FirstImpressionArea}>
				{_ShowDetails === false ?
					<ProjectFirstImpression
						className={Style.ProjectUVCH}
						projectName="Unreal VsCode Helper"
						moreButtonRedirection="/projects/unreal-vscode-helper"
						staticProps={props.staticProps}
						hideDescription
						hideStats
					/>
					:
					<ProjectFirstImpression
						className={Style.ProjectUVCH}
						projectName="Unreal VsCode Helper"
						moreButtonRedirection="/projects/unreal-vscode-helper"
						staticProps={props.staticProps}
					/>
				}
			</div>
		</Slide>
	);
}