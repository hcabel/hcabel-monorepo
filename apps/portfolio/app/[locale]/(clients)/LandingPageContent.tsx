"use client";

// Libs
import EventEmitter from 'events';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

// Extenral project
import { Locales } from '@hcabel/types/ProjectApi';

// Design
import Style from '../page.module.scss';
import TranslateIcon from 'Images/TranslateIcon.svg';
import ArrowIcon from 'Images/arrow.svg';

import Experience from '3D/Experience';

// Components
import Selector from 'Components/Selector/Selector';
import SlideShow from 'Components/SlideShow/SlideShow';
import ExperimentCanvas from './ExperiementCanvas';
import Slide from 'Components/SlideShow/Slide';
import Project from './project/Projects';

// Interfaces
import { GithubActivities, IProjectDatas } from '../page';

// Utils
import CookieManager from 'Utils/CookieManager';
import i18nText from 'Utils/i18Text';
import IntroSlide from './slides/IntroSlide';
import UvchSlide from './slides/UvchSlide';
import HugoMeetSlide from './slides/HugoMeetSlide';
import ProceduralTerrainSlide from './slides/ProcGenSlide';

interface ILandingPageContentProps {
	projects: IProjectDatas,
	locale: Locales,
	activities: GithubActivities
};

export default function LandingPageContent(props: ILandingPageContentProps)
{
	const [slideShowController] = useState(new EventEmitter());
	const [_IntroSlide] = useState<IntroSlide>(new IntroSlide(props.activities));
	const [_UvchSlide] = useState<UvchSlide>(new UvchSlide());
	const [_HugoMeetSlide] = useState<HugoMeetSlide>(new HugoMeetSlide());
	const [_ProceduralTerrainSlide] = useState<ProceduralTerrainSlide>(new ProceduralTerrainSlide());

	// If github activity data is changed, update the intro slide with the new data
	useEffect(() => {
		_IntroSlide.Activities = props.activities;
	}, [JSON.stringify(props.activities)]);


	// Hide all the background exect the one with the class that we specified
	function	UpdateBackground(className: string)
	{
		const backgroundChild = document.getElementById("backgrounds")?.children;
		if (!backgroundChild) {
			return;
		}

		// Change opcatity of all background children to 0 unless there is implementing className
		for (let i = 0; i < backgroundChild.length; i++) {
			if (backgroundChild[i].classList.contains(className)) {
				// set opactiy to 1
				backgroundChild[i].classList.remove(Style.Opacity_Hidden);
				backgroundChild[i].classList.add(Style.Opacity_Visible);
			} else {
				// set opactiy to 0
				backgroundChild[i].classList.add(Style.Opacity_Hidden);
				backgroundChild[i].classList.remove(Style.Opacity_Visible);
			}
		}
	}

	function	MoveCanvas(val: number) {
		const canvas = document.getElementById("LandingPage3dIllustration");
		// move canvas only if the screen is big enough
		val = window.screen.width >= 920 ? val : 0;
		if (canvas) {
			canvas.style.transform = `translateX(${val}%)`;
		}
	}

	useEffect(() => {
		// get url hashid
		const hashId = window.location.hash.slice(1);
		// Move to the right slide
		let index = 0;
		switch (hashId) {
		default: index = 0; break;
		case "uvch": index = 1; break;
		case "hugomeet": index = 2; break;
		case "procedural-terrain": index = 3; break;
		}
		slideShowController.emit('goto', index);

		// subscribe to AllowCookies changes
		CookieManager.onCookieChange('AllowCookies', (cookieValue) => {
			if (cookieValue === "true") {
				// Send post visit request to the telemetry server
				// This will tell that someone has visited the page
				fetch(`${process.env.NX_TELEMETRY_API_ENDPOINT}/visits`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						href: window.location.href,
					})
				});
			}
		});

		function resize() {
			slideShowController.emit('refresh');

			// Set condensed mode if the screen is too small
			_HugoMeetSlide.Condensed = window.innerWidth < 920;
			_ProceduralTerrainSlide.Condensed = window.innerWidth < 920;
		}

		// listen to resize and move canvas to 0 if the screen is too small
		window.addEventListener('resize', resize);

		return () => {
			// unsubscribe from AllowCookies changes
			window.removeEventListener('resize', resize);
		};
	}, []);

	useEffect(() => {
		new Experience()
			.on('ready', () => {
				// Refresh canvas to makesure that the 3d camera is well positioned
				slideShowController.emit('refresh');
			});
	}, [slideShowController]);

	return (
		<main className="Page">
			<ExperimentCanvas id="LandingPage3dIllustration" /> {/* 3D ILLUSTATION */}
			<div id="backgrounds" className={Style.Background}>
				<div className={`${Style.Background_NightClub} ${Style.Background}`} />
				<div className={`${Style.Background_Ocean} ${Style.Background}`} />
				<div className={`${Style.Background_Peach} ${Style.Background}`} />
				<div className={`${Style.Background_Meadow} ${Style.Background}`} />
			</div>
			<div className={Style.HtmlPageContent} id="HtmlPageContent" >
				<SlideShow
					controller={slideShowController}
				>
					{/* INTRO */}
					<Slide
						onEnter={(self: any, direction: number) => {
							// Change background
							UpdateBackground(Style.Background_NightClub);
							// Move canvas to the center
							MoveCanvas(0);

							_IntroSlide.onEnter(direction);
						}}
						onScroll={(self: any, progress: number) => _IntroSlide.onScroll(progress)}
						onLeave={(self: any, direction: number) =>  _IntroSlide.onLeave(direction)}
						length={100}
						LeaveTransition={{
							duration: 0.75,
						}}
					>
						<div className={Style.SlideIntro}>
							<div className={Style.Description}>
								<h1 className={`h1 ${Style.Name}`} data-cy="my-real-name">Hugo Cabel</h1>
								<h3 className={`h4 ${Style.Job}`} data-cy="my-job">{i18nText("MyJob", props.locale)}</h3>
							</div>
							<Link className={Style.Freelance} href={`/${props.locale}/freelance`}>
								<h5 className={`h5 ${Style.FreelanceText}`}>{"Freelance"}</h5>
							</Link>
							<div className={Style.MyProject} onClick={() => slideShowController.emit('goto', 1)}>
								<ArrowIcon />
								<h5 className={`h5 ${Style.MyProjectText}`}>{i18nText("MyProjects-Title", props.locale)}</h5>
								<ArrowIcon />
							</div>
						</div>
					</Slide>
					{/* UVCH */}
					<Slide
						onEnter={(self: any, direction: number) => {
							// Change background
							UpdateBackground(Style.Background_Ocean);
							// Move canvas to the right
							MoveCanvas(25);

							_UvchSlide.onEnter(direction);
						}}
						onScroll={(self: any, progress: number) => _UvchSlide.onScroll(progress)}
						onLeave={(self: any, direction: number) => _UvchSlide.onLeave(direction)}
						length={200}
						LeaveTransition={{
							duration: 0.75,
						}}
					>
						<div className={Style.Slide}>
							<Project
								locale={props.locale}
								project={props.projects["Unreal VsCode Helper"]}
								className={Style.SlideProjectUVCH}
								moreButtonRedirection="/redirects/unreal-vscode-helper"
							/>
						</div>
					</Slide>
					{/* HUGO MEET */}
					<Slide
						onEnter={(self: any, direction: number) => {
							// Move canvas to the right
							MoveCanvas(25);
							// Change background color
							UpdateBackground(Style.Background_Peach);

							_HugoMeetSlide.onEnter(direction);
						}}
						onScroll={(self: any, progress: number) => _HugoMeetSlide.onScroll(progress)}
						onLeave={(self: any, direction: number) => _HugoMeetSlide.onLeave(direction)}
						length={200}
						LeaveTransition={{
							duration: 0.75,
						}}
					>
						<div className={Style.Slide}>
							<Project
								locale={props.locale}
								project={props.projects["HugoMeet"]}
								className={Style.ProjectHugoMeet}
								moreButtonRedirection={"/redirects/hugomeet"}
								moreTextOverride={i18nText("Go to HugoMeet", props.locale)}
							/>
						</div>
					</Slide>
					{/* PROCEDURAL TERRAIN */}
					<Slide
						onEnter={(self: any, direction: number) => {
							// Move canvas to the right
							MoveCanvas(25);
							// Change background color
							UpdateBackground(Style.Background_Meadow);

							_ProceduralTerrainSlide.onEnter(direction);
						}}
						onScroll={(self: any, progress: number) => _ProceduralTerrainSlide.onScroll(progress)}
						onLeave={(self: any, direction: number) => _ProceduralTerrainSlide.onLeave(direction)}
						length={300}
					>
						<div className={Style.Slide}>
							<Project
								locale={props.locale}
								project={props.projects["Procedural Terrain"]}
								className={Style.ProjectProceduralTerrain}
							/>
						</div>
					</Slide>
				</SlideShow>
			</div>
			<Selector
				className={Style.LocalSelector}
				renderSelected={(selected) => (
					<div data-cy='language-selector'className={`${Style.LocalLink} ${Style.LocalSelected}`}>
						<TranslateIcon />
						<span>{selected || "language"}</span>
					</div>
				)}
				firstHasDefault
			>
				{[ props.locale, ...["fr", "en"].filter((lang) => lang !== props.locale) ]
					.map((lang, index) => {
						const regionNamesInEnglish = new Intl.DisplayNames(lang, { type: 'language' });
						return (
							<span key={index} data-cy={`language-selector-option-${lang}`}>
								<Link className={Style.LocalLink} href={`/${lang}`}>
									{regionNamesInEnglish.of(lang)}
								</Link>
							</span>
						);
					})
				}
			</Selector>
		</main>
	);
}