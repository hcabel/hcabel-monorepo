import Link from "next/link";

import Style from "./page.module.scss";

import OrangeWaveUpsideDown from "Images/OrangeWaveUpsideDown.svg";
import Arrow from "Images/arrow.svg";
import BoxScroller from "Components/BoxScroller/BoxScroller";
import ServicesCard from "./(elements)/ServicesCard";

import Tools from "Images/Tools.svg";
import Server from "Images/Server.svg";
import Handshake from "Images/Handshake.svg";
import Camera from "Images/Camera.svg";
import Monitor from "Images/Monitor.svg";
import Controller from "Images/Controller.svg";
import LightPurplePeaksStacked from "Images/LightPurplePeaksStacked.svg";
import Malt from "Images/Malt.svg";
import Linkedin from "Images/Linkedin.svg";
import i18nText from "Utils/i18Text";

export default async function freelance({ params: { locale } }: any)
{
	return (
		<main className={`Page ${Style.FreelancePage}`}>
			<Link className={Style.BackToLandingPageArrow} href={`/${locale}`} aria-label="Go back to the landing page">
				<Arrow />
			</Link>
			<header>
				<div className={Style.FirstSection}>
					<h1 className={Style.Title}>Freelance</h1>
				</div>
				<OrangeWaveUpsideDown />
			</header>
			<section className={Style.WhatIdo}>
				<h2>{i18nText("What I do", locale)} :</h2>
				<BoxScroller useSnap entryClassName={Style.CardsEntry}>
					<ServicesCard
						title={i18nText("Unreal Engine Tools Programmer", locale)}
						description={i18nText("Unreal Engine Tools Programmer - Description", locale)}
						icon={<Tools />}
					/>
					<ServicesCard
						title={i18nText("Unreal Engine Gameplay Programmer", locale)}
						description={i18nText("Unreal Engine Gameplay Programmer - Description", locale)}
						icon={<Controller />}
					/>
					<ServicesCard
						title={i18nText("Front-End Design Implementation", locale)}
						description={i18nText("Front-End Design Implementation - Description", locale)}
						icon={<Monitor />}
					/>
					<ServicesCard
						title={i18nText("Backend Development", locale)}
						description={i18nText("Backend Development - Description", locale)}
						icon={<Server />}
					/>
					<ServicesCard
						title={i18nText("WebRTC Development", locale)}
						description={i18nText("WebRTC Development - Description", locale)}
						icon={<Camera />}
					/>
					<ServicesCard
						className={Style.CollaborateCard}
						title={i18nText("Let's Collaborate and Brainstorm!", locale)}
						description={i18nText("Let's Collaborate and Brainstorm! - Description", locale)}
						icon={<Handshake />}
					/>
				</BoxScroller>
			</section>
			<section className={Style.ContactMe}>
				<LightPurplePeaksStacked />
				<div className={Style.SectionInner}>
					<div className={Style.Platforms}>
						<a href="https://www.malt.fr/profile/hugocabel" aria-label={i18nText("Go to my Malt profile", locale)}>
							<Malt />
						</a>
						<a href="https://www.linkedin.com/in/hugo-cabel-553701202/" aria-label={i18nText("Go to my LinkeIn profile", locale)}>
							<Linkedin />
						</a>
					</div>
					<h3 className={`h3 ${Style.Email}`}>freelance@hugocabel.com</h3>
				</div>
			</section>
		</main>
	)
}