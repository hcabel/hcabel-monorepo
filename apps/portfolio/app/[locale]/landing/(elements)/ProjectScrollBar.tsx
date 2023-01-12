"use client";

// Libs
import { useEffect } from 'react';

// Design
import Style from './ProjectScroll.module.scss';

// Hooks
import { useRouter } from 'next/navigation';
import { useLocale } from 'App/[locale]/LocaleContext';
import ProjectsInfos from '../getProjectsInfos';

interface IProjectScrollBarProps {
	children: React.ReactNode;
}

export default function ProjectScrollBar(props: IProjectScrollBarProps)
{
	const { locale } = useLocale();
	const router = useRouter();

	// Prefetch All the slide so that the transition is near instant, and the user doesn't feel the switch of page when scrolling
	useEffect(() => {
		ProjectsInfos.forEach((project) => {
			router.prefetch(`${locale}${project.url}`);
		});
	}, [locale])

	return (
		<div style={{ scrollBehavior: 'auto' }}>
			<div id="ScrollContent" className={Style.ScrollContent}>
				{props.children}
			</div>
			<div id="InvisibleDivs">
				{ProjectsInfos.map((project, i) =>
					<div id={`InvisibleDiv_${i}`} className={`${Style.Background} ${project.background}`} key={i} style={{ height: `calc(100vh + ${project.height})` }} />
				)}
			</div>
		</div>
	);
}