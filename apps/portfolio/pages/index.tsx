import styles from '@styles/pages/index.module.scss';
import { useEffect } from 'react';

import Canvas3D from '@3D/Canvas3D';

export function Index() {

	useEffect(() => {
		new Canvas3D(document.querySelector('.experience-canvas'));
	}, [])

	return (
		<div className={styles.page}>
			<canvas className="experience-canvas"></canvas>
		</div>
	);
}

export default Index;
