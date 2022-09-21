import Style from '@styles/pages/index.module.scss';
import { useEffect } from 'react';

import Canvas3D from '@3D/Canvas3D';
import ProjectSection from '@Components/ProjectSection';

export function Index() {

	useEffect(() => {
		new Canvas3D(document.getElementById('Canvas3D') as HTMLCanvasElement);
	}, [])

	return (
		<div className={`Page ${Style.Page}`}>
			<canvas id="Canvas3D">
			</canvas>
			<main className={Style.HtmlPageContent}>
				<ProjectSection
					className={Style.ProjectUVCHDescription}
					title="Unreal VsCode Helper"
				/>
			</main>
		</div>
	);
}

export default Index;
